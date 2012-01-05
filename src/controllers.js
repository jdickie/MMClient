/*
Controllers.js
*/
 (function($, MITHGrid, Interedition) {
    var Controller = Interedition.Client.AnnotationRegistration.namespace('Controller');

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
                    var children = obj.parentNode.childNodes,
					num, i;
					$.each(children, function(i, o) {
						if (children[i].isSameNode(obj)) {
                            return i;
                        }
					});
                }

                return null;
            },
            sel,
            startIndex,
			endIndex,
			endNode,
			startNode,
            textDiv = binding.locate('doc');

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

                options.events.onMouseUp.fire([{
					sel: sel, 
					start: startIndex, 
					end: endIndex, 
					startNode: startNode, 
					endNode: endNode
				}]);
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
        var that = MITHGrid.Controller.initController('Interedition.Client.AnnotationRegistration.Controller.Buffer', options);
        options = that.options;

        that.applyBindings = function(binding, opts) {

            };

        return that;
    };

    /*
	Interface between Annotation Registration server, constraint server
	*/
    Controller.namespace('Server');
    Controller.Server.initController = function(options) {
        var that = MITHGrid.Controller.initController('Interedition.Client.AnnotationRegistration.Controller.Server', options),
		registerBodyURL, registerTargetURL;
        options = that.options;

		registerBodyURL = options.bodyURL;
		registerTargetURL = options.targetURL;
        that.applyBindings = function(binding, opts) {
            var sendAnnoRequest = function(annoSend) {
                // push to the annotation server
                $.ajax({
                    url: opts.phpCDBypass,
                    type: 'POST',
                    dataType: 'text',
                    data: {
                        urlsend: opts.post_anno_uri,
                        datasend: JSON.stringify(annoSend)
                    },
                    success: function(d) {
                        $(container).append('<p>' + d + '</p>');
                    },
                    error: function(xhr, status, e) {
                        console.log('error ' + e + '  ' + JSON.stringify(xhr));
                    }
                });
            },
            createConstraint = function() {
				
            };

            binding.registerBody = function(bodyObj) {
				$.ajax({
					url: registerBodyURL,
					type: 'POST',
					dataType: 'text',
					data: bodyObj,
					success: function(u) {
						options.events.onCallSuccess.fire(u);
					}
				});
            };

            binding.registerTarget = function(targetObj) {
				$.ajax({
					url: registerTargetURL,
					type: 'POST',
					dataType: 'text',
					data: targetObj,
					success: function(u) {
						options.events.onCallSuccess.fire(u);
					}
				});
            };

			binding.getConstraint = function(cObj) {
				// call constraint service
	            $.ajax({
	                url: phpCDBypass,
	                type: 'POST',
	                dataType: 'text',
	                data: {
	                    urlsend: opts.constrain_anno_uri,
	                    datasend: JSON.stringify(cObj)
	                },
	                beforeSend: function(xhr) {
	                    // show loading
	                    $("#targetmessage").empty().append("<p>Loading...</p>");
	                },
	                afterSend: function() {
	                    $("#targetmessage").empty();
	                },
	                success: function(constraint) {
	                    $("body:first").trigger("TargetTextParsed", [txt, textURI, JSON.parse(constraint)]);
	                },
	                complete: function(xhr, status) {
	                    console.log(xhr);
	                }
	            });
			};
        };

        return that;
    };

} (jQuery, MITHGrid, Interedition));
