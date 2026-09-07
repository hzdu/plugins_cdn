namespace AmeNavMenuVisibilityUi {
	interface VisibilitySettingsData {
		grantAccess?: Record<string, boolean>;
		loggedInUsers?: boolean;
		anonymousUsers?: boolean;
	}

	type NavigationItemType = string;

	interface NavigationItemData {
		label: string;
		type: NavigationItemType;
		settings: VisibilitySettingsData;
		children: NavigationItemData[];

		//Properties used to match up the item with the underlying block or menu item.
		//The UI doesn't need to know what they are, just pass them back to the server.
		passThroughProps: Record<string, unknown>;
	}

	interface NavigationMenuData {
		id: number;
		type: 'classic' | 'block';
		label: string;
		items: NavigationItemData[];
	}

	export interface ScriptData {
		navigationMenus: NavigationMenuData[];
		saveNonce: string;
		selectedActor: string | null;
	}

	interface StorableNavigationMenuData {
		id: number;
		type: NavigationMenuData['type'];
		items: StorableNavigationItemData[];
	}

	interface StorableNavigationItemData {
		settings: VisibilitySettingsData;
		passThroughProps: NavigationItemData['passThroughProps'];
	}

	interface StorableNavigationMenuData {
		id: number;
		type: NavigationMenuData['type'];
		items: StorableNavigationItemData[];
	}

	const loggedInUserActor = new class extends AmeBaseActor {
		constructor() {
			super('special:logged_in_user', 'Logged In Users', {});
		}

		hasOwnCap(capability: string): boolean | null {
			//The only capability that *all* roles and users have is the special "exist" capability.
			return (capability === 'exist');
		}
	}

	const anonymousUserActor = new class extends AmeBaseActor {
		constructor() {
			super('special:anonymous_user', 'Logged Out Users', {});
		}

		hasOwnCap(capability: string): boolean | null {
			//The only capability that *all* roles and users have is the special "exist" capability.
			return (capability === 'exist');
		}
	}

	class NavigationItem {
		public readonly label: string;
		public readonly type: NavigationItemType;
		public readonly children: NavigationItem[];

		private readonly passThroughProps: NavigationItemData['passThroughProps'];

		private readonly enabledForActor: AmeObservableActorFeatureMap;
		private readonly loggedInUsersEnabled: KnockoutObservable<boolean>;
		private readonly anonymousUsersEnabled: KnockoutObservable<boolean>;

		public readonly isChecked: KnockoutComputed<boolean>;
		public readonly isLocked: KnockoutComputed<boolean>;

		/**
		 * Whether the navigation item would be hidden from the currently selected actor.
		 *
		 * This is generally the opposite of `isChecked`, unless the current actor is a user/role
		 * and the item is disabled for logged-in users. In that case, the item can stay checked
		 * (i.e. existing user/role settings are preserved), but the item will be hidden.
		 */
		public readonly isHidden: KnockoutComputed<boolean>;

		constructor(data: NavigationItemData, selectedActor: KnockoutObservable<IAmeActor | null>) {
			this.label = data.label;
			this.type = data.type;

			this.enabledForActor = new AmeObservableActorFeatureMap(data.settings.grantAccess);
			this.loggedInUsersEnabled = ko.observable(data.settings.loggedInUsers ?? true);
			this.anonymousUsersEnabled = ko.observable(data.settings.anonymousUsers ?? true);

			this.children = data.children.map(
				childData => new NavigationItem(childData, selectedActor)
			);
			this.passThroughProps = data.passThroughProps;

			this.isChecked = ko.computed({
				read: () => {
					const currentActor = selectedActor();
					if (currentActor === null) {
						return false;
					}

					if (currentActor === loggedInUserActor) {
						return this.loggedInUsersEnabled();
					} else if (currentActor === anonymousUserActor) {
						return this.anonymousUsersEnabled();
					}

					return this.enabledForActor.isEnabledFor(currentActor, null, true, null, true);
				},
				write: (value: boolean) => {
					const currentActor = selectedActor();
					if (currentActor === null) {
						return;
					}

					if (currentActor === loggedInUserActor) {
						this.loggedInUsersEnabled(value);
					} else if (currentActor === anonymousUserActor) {
						this.anonymousUsersEnabled(value);
					} else {
						this.enabledForActor.setEnabledFor(currentActor, value, null, true);
					}

					//Check/uncheck all children when the parent is checked/unchecked.
					this.children.forEach(child => child.isChecked(value));
				},
				owner: this
			});

			this.isLocked = ko.pureComputed(() => {
				//If the item is disabled for "logged-in users", lock the checkbox when a role
				//or user (or Super Admin) is selected. Those settings have no effect if logged-in
				//users can't see the item at all.
				const currentActor = selectedActor();
				if (
					(currentActor === null)
					|| (currentActor === loggedInUserActor)
					|| (currentActor === anonymousUserActor)
				) {
					return false;
				}

				return !this.loggedInUsersEnabled();
			});

			this.isHidden = ko.pureComputed(() => {
				return !this.isChecked() || this.isLocked();
			});
		}

		toJs(): StorableNavigationItemData[] {
			const results: StorableNavigationItemData[] = [{
				settings: {
					grantAccess: this.enabledForActor.getAll(),
					loggedInUsers: this.loggedInUsersEnabled(),
					anonymousUsers: this.anonymousUsersEnabled()
				},
				passThroughProps: this.passThroughProps
			}];

			const children = this.children.map(child => child.toJs());

			return results.concat(...children);
		}
	}

	class NavigationMenu {
		private readonly id: number;
		public readonly label: string;
		public readonly type: NavigationMenuData['type'];
		public readonly items: NavigationItem[];

		constructor(data: NavigationMenuData, selectedActor: KnockoutObservable<IAmeActor | null>) {
			this.id = data.id;
			this.label = data.label;
			this.type = data.type;
			this.items = data.items.map(itemData => new NavigationItem(itemData, selectedActor));
		}

		toJs(): StorableNavigationMenuData {
			return {
				id: this.id,
				type: this.type,
				items: this.items.map(item => item.toJs()).flat()
			};
		}
	}

	export class VisibilityEditor {
		public readonly navigationMenus: NavigationMenu[];

		public readonly isSaving = ko.observable(false);
		public readonly settingsToSave = ko.observable('');
		public readonly selectedActorId: KnockoutObservable<string>

		constructor(data: ScriptData) {
			AmeActors.addSpecialActor(loggedInUserActor);
			AmeActors.addSpecialActor(anonymousUserActor);

			const actorSelector = new AmeActorSelector(AmeActors, true, false);
			actorSelector.addSpecialActor(loggedInUserActor);
			actorSelector.addSpecialActor(anonymousUserActor);

			const selectedActor = actorSelector.createActorObservable(ko);
			//Reselect the previously selected actor, or the first one if none was selected.
			if (data.selectedActor && AmeActors.actorExists(data.selectedActor)) {
				selectedActor(AmeActors.getActor(data.selectedActor));
			} else {
				selectedActor(loggedInUserActor);
			}

			this.selectedActorId = ko.pureComputed(() => {
				const actor = selectedActor();
				return actor ? actor.getId() : '';
			});

			this.navigationMenus = data.navigationMenus.map(menuData => {
				return new NavigationMenu(menuData, selectedActor);
			});
		}

		saveChanges() {
			this.isSaving(true);

			this.settingsToSave(JSON.stringify({
				menus: this.navigationMenus.map(menu => menu.toJs())
			}));

			return true;
		}
	}
}

declare const wsAmeNavMenuVisibilityData: AmeNavMenuVisibilityUi.ScriptData;

jQuery(function (_) {
	const ui = new AmeNavMenuVisibilityUi.VisibilityEditor(wsAmeNavMenuVisibilityData);
	ko.applyBindings(ui, document.getElementById('ame-nav-menu-visibility-editor'));
});