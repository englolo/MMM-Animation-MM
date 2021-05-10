/* global Module */

/* Magic Mirror
 * Module: MMM-Animation-MM
 *
 * By Lolo
 * MIT Licensed.
 */


Module.register("MMM-Animation-MM", {
    defaults: {
        animationStartDelay: 3,
		animationNotificationDelay: 8,
		lockModule: false,
	
    },

    start: function () {
        Log.info("Starting module: " + this.name);
        this.firstStart = true;
        this.activeNotification = false;
    },

    getStyles: function () {
        return ["MMM-Animation-MM.css"];
    },

    getDom: function () {      
        var wrapper = document.createElement("div");
		wrapper.id = "overlay"
		if(this.config.animationSize && this.config.animationSize >= "0" && this.config.animationSize <= "80" ){
		wrapper.style.setProperty('--animation-text-size',`-${this.config.animationSize}%`); 
		}
		if (this.firstStart === true) {
			wrapper.style.setProperty('--animation-forward-delay',`${this.config.animationStartDelay}s`); 					
        }
        if (this.activeNotification === true) {
			wrapper.style.setProperty('--animation-forward-delay',`${this.config.animationNotificationDelay}s`);
			this.activeNotification = false;
        }
		wrapper.appendChild(this.createLogo());
		this.listener();
        return wrapper;
    },

    listener: function () {
		window.onanimationend = e => {
            if (e.animationName === 'hideLogo'){
				if (this.config.lockModule){
				  this.showModules();	
				}							
			}			
		}
    },

    createLogo: function () {
        var animationText = document.createElement("div");
        animationText.id = "animation-wraper";
        animationText.innerHTML = "<svg id='anime-text'  viewBox='0 0 1024 300'> <path id='path504'  class='path-a' /> <path id='path506' class='path-a' /> <path id='path508' class='path-a'/> <path id='path510' class='path-a'/> <path id='path512' class='path-a'/> <path id='path514' class='path-a'/> <path id='path516' class='path-a'/> <path id='path518' class='path-a'/> <path id='path520' class='path-a'/> <path id='path522' class='path-a'/> <path id='path524' class='path-a'/> <path id='path526' class='path-b'/> <text id='tspan26' class='path-c' dx ='512' dy='250' text-anchor='middle' >The open source modular smart mirror platform </text> </svg>";
        return animationText;
    },

    notificationReceived: function (notification, payload, sender) {
        if (notification === this.config.notification && sender.name === this.config.notificationSender) {
            //console.log(this.name + " received a module notification: " + notification + " from sender: " + sender.name);
            this.firstStart = false;
			this.activeNotification = true;
            this.updateDom();
			if(this.config.lockModule){
				this.hideModules()
				};
        }
	   	if (notification === 'DOM_OBJECTS_CREATED' && this.config.lockModule) {
			this.hideModules();
		}
    },

    hideModules: function(){
	MM.getModules().exceptModule(this).exceptWithClass(this.config.ignoreModules).enumerate(function(module) {
			module.hide(100, { lockString: "mmmamm" },function(){					
				});
			});	
	},
    showModules: function(){
	MM.getModules().exceptModule(this).exceptWithClass(this.config.ignoreModules).enumerate(function(module) {
			module.show(100, { lockString: "mmmamm" },function(){					
				});
			});	
	},
	   
});
