/*
MM Client Front-End

@author: Grant Dickie

Uses MITHGrid - (c) 2011 MITH


*/

(function() {
	// Set up presentation layers
	MITHGrid.Presentation.namespace('TextBody');
	MITHGrid.Presentation.TextBody.initPresentation = function(container, options) {
		var that = MITHGrid.Presentation.initPresentation("MITHGrid.Presentation.TextBody", container, options);
		
		return that;
	};
	
	
	MITHGrid.Presentation.namespace('URIBody');
	MITHGrid.Presentation.URIBody.initPresentation = function(container, options) {
		var that = MITHGrid.Presentation.initPresentation("MITHGrid.Presentation.URIBody", container, options);
		
		return that;
	};
	
	MITHGrid.Presentation.namespace('Target');
	MITHGrid.Presentation.Target.initPresentation = function(container, options) {
		var that = MITHGrid.Presentation.initPresentation("MITHGrid.Presentation.Target", container, options);
		
		return that;
	};
	
	MITHGrid.Application.namespace('MMClient');
	MITHGrid.Application.MMClient.initApp = function(container, options) {
		var that = MITHGrid.Application.initApp("MITHGrid.Application.Canvas", container, $.extend(true, {}, options, {
			viewSetup: '',
			presentations: {
				URIBody: {
					type: MITHGrid.Presentation.URIBody,
					container: "#bodyURI",
					dataView: 'MM',
					lenses: {
						body: function(container, view, model, itemId) {
							// Receives all BODY URI objects defined by a URI
							var that = {}, 
							el = $(container), item = model.getItem(itemId);
							
							
							
							// validate URI
							// that.validate(item.uri[0]);
						}
					}
				},
				TextBodyDisp: {
					type: MITHGrid.Presentation.TextBody,
					container: "#bodyData",
					dataView: 'MM',
					lenses: {
						body: function(container, view, model, itemId) {
							// Receives Body objects that have text content entered
							// by the user
							
						}
					}
				},
				TargetDisp: {
					type: MITHGrid.Presentation.Target,
					container: "#targetArea",
					dataView: 'MM',
					lenses: {
						target: function(container, view, model, itemId) {
							// analyses the URI for the target and displays the item
							// that the URI is pointing to
							
							var that = {}, item = model.getItem(itemId), el = '<div><strong>Target Found:</strong><br/>';
							
							el += '<p>'+item.id[0]+'</p>'+
							'<p>'+item.type[0]+'</p>'+
							'<p>'+item.uri[0]+'</p>';
							
							
							$(container).append(el);
							
						}
					}
				}
			}
		})),
		validate = function(uri) {
			if(!(/http^/.test(uri))) return false;
			
			$.ajax({
				url: uri,
				type: 'POST',
				success: function() {
					// went through - fire event;
					$("#displaySuccess").text("Valid URI");
					$("#displaySuccess").trigger('URIValid');
					
					
					
				}
			});
		},
		getInputData = function() {
			// return either the value from textarea
			// or from the URI input depending on state of radio
			// buttons
			if($("option#text:selected").length) {
				return $("textarea").val().trim();
			} else if($("option#uri:selected").length) {
				return $("input").val().trim();
			}
		};
		
		
		that.ready(function() {
			// Application and viewSetup are complete; setting up
			// callback functions
			
			$("#submit").click(function(e) {
				e.preventDefault();
				
			
				
				// check if there already exists Annos with
				// this data
				
				var item = getInputData(), 
				duplicateSearch = that.dataStore.MM.prepare(".uri"), uris = [];
				
				// check if there is an already existing URI in store
				uris = that.dataStore.MM.evaluate([item.uri[0]]);
				if(uris.size() > 1) {
					// already present
				} else {
					// push to server
					$.ajax({
						url: 'urltoservice',
						type: 'POST',
						data: {},
						dataType: 'json',
						success: function (json) {
							$("#servermessage").append("<p>POST went through: "+JSON.stringify(json)+"</p>");
						
							that.dataStore.loadItems([json]);
						}
					});
				}
				
			});
			
			
			
		});
		
		return that;
	};
	
	// Defaults that are common for the entire application
	
	MITHGrid.defaults("MITHGrid.Application.MMClient", {
	
		dataStores: {
			// Defining what we kind of Object schema we expect from the 
			// service
			MM: {
				types: {
					annotation: {},
					body: {},
					target: {}
				}, 
				properties: {
					
				}
			}
		},
		dataViews: {
			// Only body objects that are referenced by a URI
			URIBody: {
				label: "URIBody",
				types: ["body"],
				dataStore: MM,
				filters: [".uri"]
			},
			// Body objects that are referenced by text that a user
			// enters into the textarea
			TextBody: {
				label: "TextBody",
				types: ["body"],
				dataStore: MM,
				filters: [".text"]
			},
			// All target objects. Will expand into targets referencing
			// other Annotations.
			TargetURI: {
				label: "TargetURI",
				types: ["target"],
				dataStore: MM
			},
			// Resulting annotations minted by the MM service
			AnnotationDisp: {
				label: 'AnnoDisp',
				types: ["annotation"],
				dataStore: MM
			}
		}
	});
	
	
});