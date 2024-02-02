document.addEventListener("DOMContentLoaded",(e) => {

    document.querySelectorAll(".x-accordion").forEach((proAccordion) => {

        const configAttr = proAccordion.getAttribute('data-x-accordion')
        const config = configAttr ? JSON.parse(configAttr) : {}

        if ( config.faqSchema ) {

            proAccordion.querySelectorAll(".x-accordion > .brxe-block").forEach((question) => {
                question.setAttribute('itemscope','')
                question.setAttribute('itemprop','mainEntity')
                question.setAttribute('itemtype','https://schema.org/Question')
            })

            proAccordion.querySelectorAll(".x-accordion_header > *:not(.x-accordion_icon)").forEach((name) => {
                name.setAttribute('itemprop','name')
            })

            proAccordion.querySelectorAll(".x-accordion_content").forEach((answer) => {
                answer.setAttribute('itemscope','')
                answer.setAttribute('itemprop','acceptedAnswer')
                answer.setAttribute('itemtype','https://schema.org/Answer')
            })
            
            proAccordion.querySelectorAll(".x-accordion_content-inner").forEach((text) => {
                text.setAttribute('itemprop','text')
            })
            
            document.body.setAttribute('itemscope','')
            document.body.setAttribute('itemtype','https://schema.org/FAQPage')

        }
    })

})