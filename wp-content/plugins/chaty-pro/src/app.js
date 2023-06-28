import './utils/extend';
import header from './modules/header';
import preview from './modules/preview';
import colorPicker from './modules/color-picker';
import customizeButton from './components/customize-button';
import widgetSize from './components/widget-size';
import ruleButtonPosition from './components/rule-button';
import settingsButton from './components/settings-button';
import activeWidgetHandler from './components/active-widget';
import collapse from './components/collapse';
import channels from './modules/channels';

jQuery(function() {
    header();
    preview();
    colorPicker();
    customizeButton();
    settingsButton();
    widgetSize();
    ruleButtonPosition();
    activeWidgetHandler();
    collapse();
    channels()
})