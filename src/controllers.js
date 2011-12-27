/*
Controllers.js
*/
 (function($, MITHGrid, Interedition) {
    var Controller = Interedition.Client.AnnotationRegistration.namespace('Interedition.Controllers');

    /*
For picking up rangy selections within the Javascript CDATA
*/
    Controller.namespace('Rangy');
    Controller.Rangy.initController = function(options) {
        var that = MITHGrid.Controller.initController("Interedition.Client.AnnotationRegistration.Controller.Rangy", options);
        options = that.options;

        that.applyBindings = function(binding, opts) {
            var getChildNumber = function(obj) {
                if (obj.parentNode) {
                    var children = obj.parentNode.childNodes;
                    var num;
                    for (var i = 0; i < children.length; i++) {
                        if (children[i].isSameNode(obj)) {

                            return i;
                        }
                    }
                }

                return null;
            }, 
			sel, startIndex,
			textDiv = binding.locate('textDiv');

            // Rangy object to be re-used
            rangy.init();
            // set up mouse listeners
            $(textDiv).mouseup(function(e) {
                // get the selection the user made,
                // trigger event to pass the text
                sel = rangy.getSelection();
                // add start and end indexes
                startIndex = getChildNumber(sel.anchorNode);
                endIndex = getChildNumber(sel.focusNode);

                startNode = $(sel.anchorNode.parentNode).getPath();
                endNode = $(sel.focusNode.parentNode).getPath();

                $("body:first").trigger("TargetTextSelected", [sel, startIndex, endIndex, startNode, endNode]);
            });

        };


        return that;
    };

	/*
	Buffer
	Controller API for pushing data from local datastore to a given location. Location is given through setOrigin(), data
	added through commit(), data pushed to given origin through push()
	*/
	Controller.namespace('Buffer');
	Controller.Buffer.initController = function(options) {
		that = MITHGrid.Controller.initController('Interedition.Client.AnnotationRegistration.Controller.Buffer', options);
		options = that.options;
		
		that.applyBindings = function(binding, opts) {
			
		};
		
		return that;
	};
	
	

});