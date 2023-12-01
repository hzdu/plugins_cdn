(function(){
	var e,t,n,r=function(e,t){
		return function(){
			return e.apply(t,arguments)
		}
	},i=[].slice;
	e=this.jQuery||this.Zepto;
	if(!e)throw"jQuery/Zepto required";
	this.PaymentTag=function(){
		function t(t){
			var n,i,s,o;
			t==null&&(t={}),this.changeCardType=r(this.changeCardType,this),this.restrictNumeric=r(this.restrictNumeric,this),this.formatNumber=r(this.formatNumber,this),this.handleToken=r(this.handleToken,this),this.submit=r(this.submit,this),this.$el=t.el||"<payment />",this.$el=e(this.$el),t.key||(t.key=this.$el.attr("key")||this.$el.attr("data-key")),(n=t.cvc)==null&&(t.cvc=this.$el.attr("nocvc")==null&&this.$el.attr("data-nocvc")==null),(i=t.token)==null&&(t.token=this.$el.attr("notoken")==null&&this.$el.attr("data-notoken")==null),(s=t.address)==null&&(t.address=this.$el.attr("address")!=null||this.$el.attr("data-address")!=null),(o=t.name)==null&&(t.name=this.$el.attr("name")!=null||this.$el.attr("data-name")!=null),t.form||(t.form=this.$el.parents("form")),this.options=e.extend({},this.defaults,t),this.options.key&&this.setKey(this.options.key),this.setForm(this.options.form),this.$el.delegate(".number input","keydown",this.formatNumber),this.$el.delegate(".number input","keyup",this.changeCardType),this.$el.delegate("input[type=tel]","keypress",this.restrictNumeric)
		}
		return t.replaceTags=function(t){
			var n=this;
			return t==null&&(t=document.body),e("payment, .payment-tag",t).each(function(e,t){
				return(new n({
					el:t
				})).render()
			})
		},t.prototype.defaults={
			tokenName:"stripeToken",
			token:!0,
			cvc:!0,
			address:!1,
			name:!1
		},t.prototype.render=function(){
			return this.$el.html(this.constructor.view(this)),this.$name=this.$(".name input"),this.$number=this.$(".number input"),this.$cvc=this.$(".cvc input"),this.$expiryMonth=this.$(".expiry input.expiryMonth"),this.$expiryYear=this.$(".expiry input.expiryYear"),this.$message=this.$(".message"),this
		},t.prototype.renderToken=function(t){
			return this.$token=e('<input type="hidden">'),this.$token.attr("name",this.options.tokenName),this.$token.val(t),this.$el.html(this.$token)
		},t.prototype.setForm=function(t){
			return this.$form=e(t),this.$form.bind("submit.payment",this.submit)
		},t.prototype.setKey=function(e){
			// return this.key=e,Stripe.setPublishableKey(this.key)
		},t.prototype.validate=function(){
			var t,n,r=this;
			return n=!0,this.$("input").removeClass("invalid"),this.$message.empty(),this.$("input[required]").each(function(t,i){
				i=e(i);
				if(!i.val())return n=!1,r.handleError({
					code:"required",
					input:i
				})
			}),Stripe.validateCardNumber(this.$number.val())||(n=!1,this.handleError({
				code:"invalid_number"
			})),t=this.expiryVal(),Stripe.validateExpiry(t.month,t.year)||(n=!1,this.handleError({
				code:"expired_card"
			})),this.options.cvc&&!Stripe.validateCVC(this.$cvc.val())&&(n=!1,this.handleError({
				code:"invalid_cvc"
			})),n||this.$(".invalid:input:first").select(),n
		},t.prototype.createToken=function(t){
			var n,r,i,s=this;
			return n=function(e,n){
				return n.error?t(n.error):t(null,n)
			},r=this.expiryVal(),i={
				number:this.$number.val(),
				cvc:this.$cvc.val()||null,
				exp_month:r.month,
				exp_year:r.year
			},this.options.name&&(i.name=this.$name.val()),this.options.address&&e.extend(i,this.addressVal()),Stripe.createToken(i,n)
		},t.prototype.submit=function(e){
			e!=null&&e.preventDefault(),e!=null&&e.stopImmediatePropagation();
			if(!this.validate())return;
			if(this.pending)return;
			return this.pending=!0,this.disableInputs(),this.trigger("pending"),this.$el.addClass("pending"),this.createToken(this.handleToken)
		},t.prototype.handleToken=function(e,t){
			return this.enableInputs(),this.trigger("complete"),this.$el.removeClass("pending"),this.pending=!1,e?this.handleError(e):(this.trigger("success",t),this.$el.addClass("success"),this.options.token&&this.renderToken(t.id),this.$form.unbind("submit.payment",this.submit),this.$form.submit())
		},t.prototype.formatNumber=function(e){
			var t,n,r;
			t=String.fromCharCode(e.which);
			if(!/^\d+$/.test(t))return;
			r=this.$number.val(),Stripe.cardType(r)==="American Express"?n=r.match(/^(\d{4}|\d{4}\s\d{6})$/):n=r.match(/(?:^|\s)(\d{4})$/);
			if(n)return this.$number.val(r+" ")
		},t.prototype.restrictNumeric=function(e){
			var t;
			return e.shiftKey||e.metaKey?!0:e.which===0?!0:(t=String.fromCharCode(e.which),!/[A-Za-z]/.test(t))
		},t.prototype.cardTypes={
			Visa:"visa",
			"American Express":"amex",
			MasterCard:"mastercard",
			Discover:"discover",
			Unknown:"unknown"
		},t.prototype.changeCardType=function(e){
			var t,n,r,i;
			r=Stripe.cardType(this.$number.val());
			if(!this.$number.hasClass(r)){
				i=this.cardTypes;
				for(n in i)t=i[n],this.$number.removeClass(t);return this.$number.addClass(this.cardTypes[r])
			}
		},t.prototype.handleError=function(e){
			e.message&&this.$message.text(e.message);
			switch(e.code){
				case"required":
					this.invalidInput(e.input);
					break;
				case"card_declined":
					this.invalidInput(this.$number);
					break;
				case"invalid_number":case"incorrect_number":
					this.invalidInput(this.$number);
					break;
				case"invalid_expiry_month":
					this.invalidInput(this.$expiryMonth);
					break;
				case"invalid_expiry_year":case"expired_card":
					this.invalidInput(this.$expiryYear);
					break;
				case"invalid_cvc":
					this.invalidInput(this.$cvc)
			}
			return this.$("label.invalid:first input").select(),this.trigger("error",e),typeof console!="undefined"&&console!==null?console.error("Stripe error:",e):void 0
		},t.prototype.invalidInput=function(e){
			return e.addClass("invalid"),this.trigger("invalid",[e.attr("name"),e])
		},t.prototype.expiryVal=function(){
			var e,t,n,r;
			return n=function(e){
				return e.replace(/^\s+|\s+$/g,"")
			},e=n(this.$expiryMonth.val()),r=n(this.$expiryYear.val()),r.length===2&&(t=(new Date).getFullYear(),t=t.toString().slice(0,2),r=t+r),{
				month:e,
				year:r
			}
		},t.prototype.addressVal=function(){
			var t;
			return t={},this.$(".address input").each(function(n,r){
				return t[r.name]=e(this).val()
			}),t
		},t.prototype.enableInputs=function(){
			var t;
			return t=this.$el.add(this.$form).find(":input"),t.each(function(){
				var n,r;
				return n=e(this),t.attr("disabled",(r=n.data("olddisabled"))!=null?r:!1)
			})
		},t.prototype.disableInputs=function(){
			var t;
			return t=this.$el.add(this.$form).find(":input"),t.each(function(){
				var t;
				return t=e(this),t.data("olddisabled",t.attr("disabled")),t.attr("disabled",!0)
			})
		},t.prototype.trigger=function(){
			var e,t,n;
			return t=arguments[0],e=2<=arguments.length?i.call(arguments,1):[],(n=this.$el).trigger.apply(n,[""+t+".payment"].concat(i.call(e)))
		},t.prototype.$=function(t){
			return e(t,this.$el)
		},t
	}(),document.createElement("payment"),typeof module!="undefined"&&module!==null&&(module.exports=PaymentTag),t=this,t.Stripe?e(function(){
		return typeof PaymentTag.replaceTags=="function"?PaymentTag.replaceTags():void 0
	}):(n=document.createElement("script"),n.onload=n.onreadystatechange=function(){
		if(!t.Stripe)return;
		if(n.done)return;
		return n.done=!0,typeof PaymentTag.replaceTags=="function"?PaymentTag.replaceTags():void 0
	},n.src="https://js.stripe.com/v1/",e(function(){
		var e;
		return e=document.getElementsByTagName("script")[0],e!=null?e.parentNode.insertBefore(n,e):void 0
	}))
}).call(this),function(){
	this.PaymentTag||(this.PaymentTag={}),this.PaymentTag.view=function(e){
		e||(e={});
		var t=[],n=function(e){
			var n=t,r;
			return t=[],e.call(this),r=t.join(""),t=n,i(r)
		},r=function(e){
			return e&&e.ecoSafe?e:typeof e!="undefined"&&e!=null?o(e):""
		},i,s=e.safe,o=e.escape;
		return i=e.safe=function(e){
			if(e&&e.ecoSafe)return e;
			if(typeof e=="undefined"||e==null)e="";
			var t=new String(e);
			return t.ecoSafe=!0,t
		},o||(o=e.escape=function(e){
			return(""+e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")
		}),function(){
			(function(){
				this.options.address&&t.push('\n  <div class="address">\n    <label for="paymentName">Name</label>\n    <input name="name" type="text" id="paymentName" required>\n\n    <label for="paymentAddressLine1">Address</label>\n    <input name="address_line_1" type="text" id="paymentAddressLine1" required>\n    <input name="address_line_2" type="text" id="paymentAddressLine2">\n\n    <label for="paymentAddressCity">City</label>\n    <input name="address_city" type="text" id="paymentAddressCity" required>\n\n    <div class="clear">\n      <div class="state">\n        <label for="paymentAddressState">State</label>\n        <input name="address_state" type="text" id="paymentAddressState" required>\n      </div>\n\n      <div class="zip">\n        <label for="paymentAddressZip">Zip / Postcode</label>\n        <input name="address_zip" type="text" id="paymentAddressZip" required>\n      </div>\n    </div>\n  </div>\n'),t.push('\n\n<span class="message"></span>\n\n'),this.options.name&&!this.options.address&&t.push('\n  <div class="name">\n    <label for="paymentName">Name</label>\n\n    <input type="text" id="paymentName" required>\n  </div>\n'),t.push('\n\n<div class="number">\n  <label for="paymentNumber">Card number</label>\n\n  <input type="tel" id="paymentNumber" required>\n</div>\n\n<div class="expiry">\n  <label for="paymentExpiryMonth">Expires<em> (mm/yy)</em></label>\n\n  <input class="expiryMonth" type="tel" id="paymentExpiryMonth" placeholder="mm" required>\n  <input class="expiryYear" type="tel" id="paymentExpiryYear" placeholder="yy" required>\n</div>\n\n'),this.options.cvc&&t.push('\n  <div class="cvc">\n    <label for="paymentCVC">Security code</label>\n    <input type="tel" id="paymentCVC" placeholder="CVC" maxlength="4" required>\n  </div>\n'),t.push("\n")
			}).call(this)
		}.call(e),e.safe=s,e.escape=o,t.join("")
	}
}.call(this);