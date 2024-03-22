import { $, before, css, hasAttr, matches, observeResize, offset, remove, toPx } from 'uikit-util';

const Section = {
    computed: {
        section: () =>
            $('.tm-header ~ [class*="uk-section"], .tm-header ~ * > [class*="uk-section"]'),
    },

    watch: {
        section() {
            this.$emit();
        },
    },
};

export const Header = {
    mixins: [Section],

    async connected() {
        observeResize(this.$el, () => this.$emit());
    },

    watch: {
        section(section, prev) {
            prev && this.$update();
        },
    },

    update: [
        {
            read() {
                return { height: this.$el.offsetHeight };
            },

            write({ height }) {
                const anchor =
                    this.section &&
                    !matches(this.section, '[tm-header-transparent-noplaceholder]') &&
                    ($('.uk-grid,.uk-panel:not(.uk-container)', this.section) || $('.tm-main > *'));

                if (!height || !anchor) {
                    remove(this.placeholder);
                    return;
                }

                this.placeholder ||= $(
                    '<div class="tm-header-placeholder uk-margin-remove-adjacent">'
                );

                if (anchor.previousElementSibling !== this.placeholder) {
                    before(anchor, this.placeholder);
                }

                css(this.placeholder, { height });
            },
        },
    ],
};

export const Sticky = {
    mixins: [Section],

    update: {
        read() {
            return (
                this.section &&
                hasAttr(this.$el, 'tm-section-start') && {
                    start:
                        this.section.offsetHeight <= toPx('100vh')
                            ? offset(this.section).bottom
                            : offset(this.section).top + 300,
                }
            );
        },

        events: ['resize'],
    },
};
