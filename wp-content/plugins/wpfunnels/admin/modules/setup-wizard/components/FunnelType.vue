<template>
    <div class="wizard-single-content funnel-type">
        <div class="step-header">
            <h4 class="title">Funnel Type</h4>
            <p class="description">Decide your purpose with the plugin.</p>
            <p class="description">To increase sales revenue, choose Sales Funnels.</p>
        </div>

        <div class="wizard-single-content__body">
            <select
                id="funnel-type"
                v-model="selected"
                name="page-builder"
                @change="onChange($event)"
            >
                <option
                    v-for="(option,index) in options"
                    :key="index"
                    :value="option.value"
                    :selected="option.value == 'sales'"
                >{{ option.name }}
                </option>
            </select>

            <div class="wpfnl-field-wrapper" v-if="isLmsInstalled && 'sales' === selected">
                <div class="wpfnl-fields">
                    <span class="wpfnl-checkbox no-title">
                        <input type="checkbox" name="install-lms" v-model="isIstallLms" id="install-lms" @change="isPermitted"/>
                        <label for="install-lms"></label>
                    </span>
                    <label>
                        Activate Learndash
                        <span class="wpfnl-tooltip">
                            <p>Enable to activate Learndash</p>
                        </span>
                    </label>
                </div>
                
                <!-- <p class="hints">
                    Recommended If you want to set abandoned cart recovery campaigns for sales funnels, and WooCommerce store.
                </p> -->
            </div>
            
            <div class="wpfnl-field-wrapper" v-show="'sales' === selected">
                <div class="wpfnl-fields">
                    <span class="wpfnl-checkbox no-title">
                        <input type="checkbox" name="install-wc" v-model="isIstallWc" id="install-wc" @change="isPermitted"/>
                        <label for="install-wc"></label>
                    </span>
                    <label>
                        Install WooCommerce
                        <span class="wpfnl-tooltip">
                            
                            <p>Enable to install WooCommerce</p>
                        </span>
                    </label>
                </div>
                
                <!-- <p class="hints">
                    Recommended If you want to set abandoned cart recovery campaigns for sales funnels, and WooCommerce store.
                </p> -->
            </div>

            <div class="wpfnl-field-wrapper" v-show="'sales' === selected">
                <div class="wpfnl-fields">
                    <span class="wpfnl-checkbox no-title">
                        <input type="checkbox" name="install-cartlift" :disabled="!isIstallWc" v-model="isIstallCartLift" id="install-cartlift" @change="isPermitted"/>
                        <label for="install-cartlift"></label>
                    </span>
                    <label>
                        Install CartLift
                        <span class="wpfnl-tooltip">
                            
                            <p>Enable to install CartLift</p>
                        </span>
                    </label>
                </div>
                
                <p class="hints">
                    Recommended If you want to set abandoned cart recovery campaigns for sales funnels, and WooCommerce store.
                </p>
            </div>
            
            <span class="hints" v-show="'sales' === selected">
                The following plugins will be installed for you: <span v-if="isIstallLms"><a href="#" target="_blank">Learndash</a></span><span v-if="isIstallLms && isIstallWc">, </span><span v-if="isIstallWc"><a href="https://wordpress.org/plugins/woocommerce/" target="_blank">WooCommerce</a></span> <span v-if="isIstallCartLift && isIstallWc">& <a href="https://wordpress.org/plugins/cart-lift/" target="_blank">CartLift</a></span>
            </span>
        </div>

        <div class="wizard-single-content__footer">
            <a href="#" class="wizard-btn btn-default next" @click="processWizardSubmission">Next
                <span class="wpfnl-loader" v-if="showLoader"></span>
            </a>
        </div>

    </div>
</template>

<script>
    import apiFetch from '@wordpress/api-fetch'
    import TooltipIcon from '../../../src/components/icons/TooltipIcon.vue'
    // eslint-disable-next-line no-undef
    var j = jQuery.noConflict()
    const nonce = window.setup_wizard_obj.nonce
    apiFetch.use(apiFetch.createNonceMiddleware(nonce))

    export default {
        name: 'FunnelType',
        components: {
            TooltipIcon
        },
        props: {
            // eslint-disable-next-line vue/require-default-prop
            wizardSlug: String,
            funnelType: String,
            showLoader: Boolean,
            isLmsInstalled: Boolean,
        },
        data: function () {
            return {
                options: [
                    { name: 'Sales', value: 'sales' },
                    { name: 'Lead Gen', value: 'lead' },
                    // { name: 'Both (Sales + Lead)', value: 'both' }
                ],
                isIstallWc: true,
                isIstallLms: false,
                selected: this.funnelType ? this.funnelType : 'sales',
                isIstallCartLift: true,
                
            }
        },
        mounted () {
            this.selected = this.funnelType ? this.funnelType : 'sales';
            if(this.isIstallWc){
                this.$emit('setPluginSlug', 'woocommerce',this.isIstallCartLift)
            }
            this.$emit('changeSetUpType', 'plugin')
        },
        methods: {
            processWizardSubmission: function (e) {
                e.preventDefault();
                this.$emit('processSettings')
            },

            isPermitted: function (e) {
                e.preventDefault();

                if( this.isLmsInstalled && this.isIstallLms){
                    this.$emit('setPluginSlug', 'learndash',this.isIstallLms)
                }

                if(this.isIstallWc){
                    this.$emit('setPluginSlug', 'woocommerce',this.isIstallCartLift)
                }else if(!this.isIstallWc){
                    this.isIstallCartLift = false
                    this.$emit('setPluginSlug', false , this.isIstallCartLift)
                }
            },
            
            onChange (event) {
                this.$emit('changeFunnelType', this.selected)
                if ('sales' === event.target.value ) {
                    if(this.isIstallWc){
                        this.$emit('setPluginSlug', 'woocommerce',this.isIstallCartLift)
                    }else{
                        this.$emit('setPluginSlug', false,this.isIstallCartLift)
                    }

                    
                } else if ('lead' === event.target.value ) {
                    this.isIstallWc = false;
                    this.isIstallCartLift = false
                    this.$emit('setPluginSlug', false , this.isIstallCartLift)
                    // this.$emit('setPluginSlug', 'fluentform')
                } else if ( 'both' === event.target.value ) {
                    this.$emit('setPluginSlug', 'both')
                }
            },
        }
    }
</script>
