import React                          from 'react';
import SettingsFormPropsPlanInterface from '../../interfaces/SettingsFormPropsPlanInterface';

interface LockedFieldWrapperProps {
    slug: string;
    children: React.ReactNode;
    locked: boolean;
    requiredPlans: string;
    plan: SettingsFormPropsPlanInterface;
}

const LockedFieldWrapper: React.FC<LockedFieldWrapperProps> = ( { plan, slug, children, locked = false, requiredPlans = '' } ) => {
    const upgradeUrl = plan.plan_level === 0 ? `https://www.checkoutwc.com/lite-upgrade/?utm_campaign=liteplugin&utm_medium=admin-page-${encodeURIComponent(
        slug,
    )}&utm_source=WordPress&utm_content=Unlock+with+Premium` : 'https://www.checkoutwc.com/documentation/upgrading-your-license/';

    if ( !locked ) {
        return <>{children}</>;
    }

    return (
        <div>
            <div className="relative w-full inset-0 ring-1 ring-black ring-opacity-5 shadow-lg rounded-md p-6 space-y-6">
                {/* Disable interactions with opacity & pointer-events */}
                <div className="opacity-50 pointer-events-none space-y-6">
                    {children}
                </div>
                <div className={'space-y-4'}>
                    <p className={'flex justify-center'}>
                        <a
                            href={upgradeUrl}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded shadow-lg hover:text-white"
                        >
                            {plan.plan_level > 0 ? 'Upgrade Your License' : 'Unlock with Premium'}
                        </a>
                    </p>
                    <p className={'text-center italic text-gray-500'}>
                        A <span dangerouslySetInnerHTML={{ __html: requiredPlans }}></span> plan is required to access
                        these features.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default LockedFieldWrapper;
