import React, { ChangeEvent, MouseEvent, useState }       from 'react';
import { Modal }                                          from 'react-responsive-modal';
import { Button, Flex }                                   from '@wordpress/components';
import GuaranteeBadge                                     from '../../components/Badges/GuaranteeBadge';
import ReviewBadge                                        from '../../components/Badges/ReviewBadge';
import TrustBadgeInterface                                from '../../interfaces/TrustBadgeInterface';
import MediaLibraryButton                                 from './MediaLibraryButton';
import RichTextArea                                       from './RichTextArea';
import { cfw__ }                                          from '../../functions/translationWrappers';
import RuleSet                                            from './Metaboxes/Fields/Rules/RuleSet';
import { RuleType }                                       from './Metaboxes/Fields/Rules/RuleField';

interface TrustBadgeRowProps {
    badge: TrustBadgeInterface;
    setBadge: ( badge: TrustBadgeInterface ) => void;
    removeHandler: ( event: MouseEvent<HTMLButtonElement> ) => void;
    dragHandleProps: any; // You might want to use a specific type if you know the shape or library you're using
}

function TrustBadgeRow( { badge, setBadge, removeHandler, dragHandleProps }: TrustBadgeRowProps ): React.JSX.Element {
    const [ isOpen, setIsOpen ] = useState( false );

    const setTitle = ( value: string ) => {
        const badgeCopy: TrustBadgeInterface = { ...badge };
        badgeCopy.title = value;
        setBadge( badgeCopy );
    };

    const setSubTitle = ( value: string ) => {
        const badgeCopy: TrustBadgeInterface = { ...badge };
        badgeCopy.subtitle = value;
        setBadge( badgeCopy );
    };

    const setDescription = ( value: string ) => {
        const badgeCopy: TrustBadgeInterface = { ...badge };
        badgeCopy.description = value;
        setBadge( badgeCopy );
    };

    const setImage = ( value: Record<string, unknown> ) => {
        const badgeCopy: TrustBadgeInterface = { ...badge };
        badgeCopy.image = value;
        setBadge( badgeCopy );
    };

    const setTemplate = ( value: string ) => {
        const badgeCopy: TrustBadgeInterface = { ...badge };
        badgeCopy.template = value;
        setBadge( badgeCopy );
    };

    const setMode = ( value: string ) => {
        const badgeCopy: TrustBadgeInterface = { ...badge };
        badgeCopy.mode = value;
        setBadge( badgeCopy );
    };

    const setRules = ( value: RuleType[] ) => {
        const badgeCopy: TrustBadgeInterface = { ...badge };
        badgeCopy.rules = value;
        setBadge( badgeCopy );
    };

    return (
        <div className="flex space-x-4 items-start group mb-6">
            <div
                className="shrink align-baseline"
                {...dragHandleProps}
            >
                <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">&nbsp;</label>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="w-6 h-6 transition-all stroke-gray-300 group-hover:stroke-gray-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 max-w-md">
                <div className="col-span-full flex space-x-4 items-center group">
                    <label className="grow block text-sm font-medium leading-6 text-gray-900">
                        Title
                        <input
                            type="text"
                            placeholder="Title"
                            value={badge.title}
                            onChange={( e: ChangeEvent<HTMLInputElement> ) => setTitle( e.target.value )}
                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </label>

                    <label
                        className="grow block text-sm font-medium leading-6 text-gray-900"
                        style={badge.template === 'guarantee' ? { display: 'none' } : {}}
                    >
                        Subtitle
                        <input
                            type="text"
                            placeholder="Subtitle"
                            value={badge.subtitle}
                            onChange={( e: ChangeEvent<HTMLInputElement> ) => setSubTitle( e.target.value )}
                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </label>
                </div>
                <div className="col-span-full flex space-x-4 items-start group">
                    <div className="grow">
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                            Template
                            <select
                                value={badge.template}
                                onChange={( e: ChangeEvent<HTMLSelectElement> ) => setTemplate( e.target.value )}
                                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            >
                                <option value="guarantee">Guarantee</option>
                                <option value="review">Review</option>
                            </select>
                        </label>
                    </div>

                    <div className="grow">
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                            Image
                            <MediaLibraryButton value={badge.image} setAttachment={setImage}/>
                        </label>
                        {badge.image && (
                            <a
                                href="#"
                                onClick={( e ) => {
                                    e.preventDefault();
                                    setImage( null );
                                }}
                                className="block font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline mt-1"
                            >
                                {cfw__( 'Clear image', 'checkout-wc' )}
                            </a>
                        )}
                    </div>
                </div>

                <div className="col-span-full">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        Description
                    </label>
                    <RichTextArea value={badge.description} initialMode={badge.mode} onSelect={setDescription}
                        onModeChange={setMode} id={badge.id}/>
                </div>

                <div className="col-span-full">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        Display Conditions
                    </label>

                    <button
                        type="button"
                        className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={() => setIsOpen( true )}
                    >
                        {cfw__( 'Manage Display Conditions' )}
                    </button>

                    <Modal
                        open={isOpen}
                        onClose={() => setIsOpen( false )}
                        center={true}
                        classNames={{
                            root: 'cfw-modal-root',
                            overlay: 'cfw-modal-overlay',
                            modal: 'cfw-modal',
                            modalContainer: 'cfw-modal-container',
                        }}
                        showCloseIcon={false}
                    >
                        <h1>Display Conditions</h1>
                        <h3>Determine when this Trust Badge should be displayed.</h3>
                        <RuleSet rules={badge.rules} onChange={setRules}/>

                        <Flex justify="flex-end">
                            <Button variant={'primary'} size={'default'} onClick={() => setIsOpen( false )}>
                                Close
                            </Button>
                        </Flex>
                    </Modal>
                </div>
            </div>
            <div className="grow h-full flex justify-center items-center">
                <div className="max-w-xl w-full shadow rounded-lg p-4">
                    {badge.template === 'guarantee' ? (
                        <GuaranteeBadge
                            title={badge.title.length ? badge.title : 'Guarantee Title'}
                            description={badge.description.length ? badge.description : 'The details of your guarantee.'}
                            imageUrl={badge.image?.url}
                        />
                    ) : (
                        <ReviewBadge
                            title={badge.title.length ? badge.title : 'Example Customer Name'}
                            subtitle={badge.subtitle?.length ? badge.subtitle : 'Example Customer Role'}
                            description={badge.description.length ? badge.description : 'The glowingly positive review text!'}
                            imageUrl={badge.image?.url}
                        />
                    )}
                </div>
            </div>
            <div className="shrink">
                <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">&nbsp;</label>
                <div>
                    <button
                        onClick={( e ) => {
                            // eslint-disable-next-line no-alert
                            if ( window.confirm( 'Are you sure you want to remove this trust badge?' ) ) {
                                e.preventDefault();
                                removeHandler( e );
                            }
                        }}
                        className="transition-all bg-gray-300 group-hover:bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-1 rounded-full inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TrustBadgeRow;
