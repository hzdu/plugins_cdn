import React from 'react';

const UpgradeRequiredNotice = ( { requiredPlans } ) => {
    const accountUrl = 'https://www.checkoutwc.com/account/';
    const upgradeHelpUrl = 'https://kb.checkoutwc.com/article/53-upgrading-your-license';

    return (
        <div className="cfw-license-upgrade-blocker bg-blue-50 border-l-4 border-blue-400 p-4 shadow basis-full mt-2">
            <div className="flex">
                <div className="flex-shrink-0">
                    {/* Heroicon name: solid/information-circle */}
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between text-blue-600">
                    <p className="text-sm">
                        A <span dangerouslySetInnerHTML={ { __html: requiredPlans } }></span> plan is required to access this feature.
                        You can upgrade your license in <a className='underline font-bold hover:text-blue-400' target="_blank" href={accountUrl}>Account</a>. For help upgrading your license, <a className='underline font-bold hover:text-blue-400' target="_blank" href={upgradeHelpUrl}>click here.</a>
                    </p>
                    <p className="mt-3 text-sm md:mt-0 md:ml-6">
                        <a href={accountUrl} className="whitespace-nowrap font-medium text-blue-600 hover:text-blue-400">Upgrade Now <span aria-hidden="true">&rarr;</span></a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UpgradeRequiredNotice;
