import React                         from 'react';
import GuaranteeBadge                from '../../components/Badges/GuaranteeBadge';
import ReviewBadge                   from '../../components/Badges/ReviewBadge';
import TrustBadgeInterface           from '../../interfaces/TrustBadgeInterface';
import DataService                   from '../Services/DataService';

const badges = DataService.getSetting( 'trust_badges' );
const row = DataService.getSetting( 'trust_badges_display' ) !== 'below_cart_summary';

const TrustBadges: React.FC = () => (
    <div className={`flex mt-4 items-start ${row ? 'flex-row flex-wrap' : 'flex-col'}`}>
        {badges.map( ( badge: TrustBadgeInterface ) => {
            switch ( badge.template ) {
                case 'guarantee':
                    return (
                        <GuaranteeBadge
                            key={badge.id}
                            title={badge.title}
                            description={badge.description}
                            imageUrl={badge.image?.url}
                        />
                    );
                case 'review':
                    return (
                        <ReviewBadge
                            key={badge.id}
                            title={badge.title}
                            subtitle={badge.subtitle}
                            description={badge.description}
                            imageUrl={badge.image?.url}
                        />
                    );
                default: return null;
            }
        } )}
    </div>
);

export default TrustBadges;
