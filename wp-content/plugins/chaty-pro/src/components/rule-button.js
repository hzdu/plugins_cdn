const $ = window.jQuery;
export default function ruleButtonPosition() {
 
    // handle button postion when new rule is added
    function addRuleHandler({ $scope, $current }) {
        const $button   = $scope.find('.rule-btns');
        const $children = $scope.find('.chaty-data-and-time-rules').children();
        $button.css({
            marginTop: $children && $children.length === 1 ? '20px' : '0px'
        });
        $current.append( $button );
    }

    // handle button position when rule is removed
    function removeRuleHandler( $scope, type = 'single' ) {
        const $button = $scope.find('.rule-btns');

        if( type === 'single' ) {
            if( $scope.parent().children().length === 2 ) {
                $scope.parent().find('.rule-btns').css({marginTop: '20px'})
            }
    
            if( $button && $scope.prev().length === 1 ) {
                $scope.prev().append($button)
            }
        }

        if( $button && $scope.prev().length === 0 || type === 'all' ) {
            $button.css({marginTop: '0'})
            $scope.parents('.chaty-option-box').append($button);
            $scope.parents('.chaty-option-box').removeClass('show-remove-rules-btn');
        }

    }

    wp.hooks.addAction( 'chaty.days_and_hours_remove_rule', 'removeRuleHandler', removeRuleHandler );
    wp.hooks.addAction( 'chaty.days_and_hours_add_rule', 'addRuleHandler', addRuleHandler )

}