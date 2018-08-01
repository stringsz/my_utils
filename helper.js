var helper = {
	config:{
		formMessageEl:'.regMessages',
		ajaxLoader:'#ajaxLoader',
		_form:'#registerForm',
	},
	
	isValidEmail :function(emailAddress) {
		if(!emailAddress) { 
			return false; 
		}
		var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
		return pattern.test(emailAddress);
	},
	
	validateField:function ($field){
		if(!parsley){ 
			console.log('COuld not find parsley'); 
		}
		if($field.parsley().isValid()){
			$field.parsley().validate()
		}
	},
	
	initCustomParsleyVaidators:function(){
		
		if(!window.Parsley.hasValidator('emailorid')) {
			var dummyEmail = $('<input data-parsley-type="email">').parsley();
			var dummyNineDigits = $('<input data-parsley-type="number" data-parsley-minLength="5">').parsley();
			Parsley.addValidator('emailorid', {
			  validateString: function(data) {
				return dummyEmail.isValid(true, data) || dummyNineDigits.isValid(true, data);
			  },
			  
			});
		}
	},
	
	initParsley:function($_form,func){
		var _self = this;
		if(!func) {
			return false;
		}
		
		if(!$_form) {
			$_form = $(this.config._form);
		}
		
		$_form.parsley({
			classHandler: function (el) {
				return el.$element.parent(); 
			},
		})
		.on('field:validated', function() {
			var ok = $_form.find('.parsley-error').length === 0;
			$($_form.find('.bs-callout-info')).toggleClass('hidden', !ok);
			$($_form.find('.bs-callout-warning')).toggleClass('hidden', ok);
		})
		.on('form:submit', function(e) {
			$(_self.config.formMessageEl).hide()
			var _url = $_form.attr('action');
			var _data = $_form.serializeArray()
		
			sendAjax(_url,'POST',_data,function(responseData){
				$(_self.config.formMessageEl).html(responseData.userMessage).show();
				grecaptcha.reset();
				if(responseData.status){
					func(responseData);
				}
			},
			_self.config.ajaxLoader);
			return false;
		});
		
		_self.initCustomParsleyVaidators();
		
	},
	
	initSteps:function(){
		
	},
	
	verifyPhonePrefix:function(elem,prefix){
		prefix =(!prefix) ? '+971-' : prefix;
		$(elem).on('keyup',function(){
			if($(this).val().substr(0,prefix.length) != prefix){
				$(this).val(prefix);
			}
		});
	},
	
	
	
};