/*
MM Client Front-End

@author: Grant Dickie

Uses MITHGrid - (c) 2011 MITH


*/

(function($, MITHGrid) {
	// Set up presentation layers
	MITHGrid.Presentation.namespace('TextRender');
	MITHGrid.Presentation.TextRender.initPresentation = function(container, options) {
		var that = MITHGrid.Presentation.initPresentation("MITHGrid.Presentation.TextRender", container, options);
		
		return that;
	};
	
	
	MITHGrid.Presentation.namespace('URIRender');
	MITHGrid.Presentation.URIRender.initPresentation = function(container, options) {
		var that = MITHGrid.Presentation.initPresentation("MITHGrid.Presentation.URIRender", container, options);
		
		return that;
	};
	
	MITHGrid.Presentation.namespace('Target');
	MITHGrid.Presentation.Target.initPresentation = function(container, options) {
		var that = MITHGrid.Presentation.initPresentation("MITHGrid.Presentation.Target", container, options);
		
		return that;
	};
	
	MITHGrid.Presentation.namespace('AnnoView');
	MITHGrid.Presentation.AnnoView.initPresentation = function(container, options) {
		var that = MITHGrid.Presentation.initPresentation("MITHGrid.Presentation.AnnoView", container, options);
		
		return that;
	};
	
	// MMClient Application - sets up HTML for interface and provides data callback functions 
	MITHGrid.Application.namespace('MMClient');
	MITHGrid.Application.MMClient.initApp = function(container, options) {
		var that = MITHGrid.Application.initApp("MITHGrid.Application.MMClient", container, $.extend(true, {}, options, {
			viewSetup: '<form id="annoRegisterForm">'+
			'<table id="Principal" summary="Principal Table">'+
			'<tr>'+
'<td><img id="validationImage" src="images/001_05.png" alt=""/></td><td> Anno Target :'+
'<br />'+
'<div id="TargetURI"> <input type="text" name="TargetURIAnno" size="39" value="">'+
'<div id="targetarea"></div>'+
'#Target Button'+
'			</div>'+
'			<br>'+
'			</td>'+
'			</tr>'+
'			<tr>'+
'			<td></td>'+
'			</tr>'+
'	<tr>'+
'			<td></td>'+
'			<td> Body : </td>'+
'			</tr>'+
'			<tr>'+
'			<td valign="top">            <input type="radio" id="RadioButtonText" name="RadioBodyText" value="" align="Top" checked>'+
'			</td>'+
'			<td>    <div id="BodyTextArea"><textarea rows="30" cols="100"> Place Here Your Body data</textarea>'+
'			</td> <td valign="top">'+
'			#Body Data'+
'			</div>'+
'			</td>'+
'			</tr>'+
'			<tr>'+
'			<td valign="top">'+
'			<input type="radio" id="RadioButtonURI" name="RadioBodyText" value="" align="Top">'+
'			</td>'+
'			<td>'+
'			<div id="BodyURI">'+
'    <input type="text" size="39" name="TargetURIBody" value="http:\\" />'+
'			#Body Data'+
'<div id="bodyDisplay"></div>'+
'			</div>'+
'			</td>'+		
'<td>'+
'<button id="submitAnno">Submit Annotation</button>'+
'</td>'+
'</tr>'+
'			</table>'+
'		</form>'+
'<div id="dataStoreDisplay"></div>', // dataStoreDisplay is for debugging
			presentations: {
				URIBody: {
					type: MITHGrid.Presentation.URIRender,
					container: "#BodyURI > #bodyDisplay",
					dataView: 'URIBody',
					lenses: {
						body: function(container, view, model, itemId) {
							// Receives all BODY URI objects defined by a URI
							var that = {}, 
							el = $(container), item = model.getItem(itemId);
							
							// validate URI
							// that.validate(item.uri[0]);
							
							return that;
						}
					}
				},
				TextBodyDisp: {
					type: MITHGrid.Presentation.TextRender,
					container: "#BodyData",
					dataView: 'TextBody',
					lenses: {
						body: function(container, view, model, itemId) {
							// Receives Body objects that have text content entered
							// by the user
							var that = {};
							
							return that;
							
						}
					}
				},
				TargetDisp: {
					type: MITHGrid.Presentation.Target,
					container: "#targetArea",
					dataView: 'TargetURI',
					lenses: {
						target: function(container, view, model, itemId) {
							// analyses the URI for the target and displays the item
							// that the URI is pointing to
							
							var that = {}, item = model.getItem(itemId), el = '<div><strong>Target Found:</strong><br/>';
							
							el += '<p>'+item.id[0]+'</p>'+
							'<p>'+item.type[0]+'</p>'+
							'<p>'+item.uri[0]+'</p>';
							$(container).append(el);
							
							that.update = function(item) {
								
							};
							
							return that;
						}
					}
				},
				AnnoDisp: {
					type: MITHGrid.Presentation.AnnoView,
					container: "#dataStoreDisplay",
					dataView: 'AnnotationDisp',
					lenses: {
						annotation: function(container, view, model, itemId) {
							var that = {}, item = model.getItem(itemId);
							
							$(container).append('<p>'+JSON.stringify(item)+'</p>');
							
							return that;
						}
					}
				}
			}
		})),
		validate = function(uri) {
			if(!(/^http/.test(uri))) {
				$("#validationImage").attr('src','images/001_05.png');
			} else {
				// went through - fire event;
				$("#validationImage").attr('src','images/001_06.png');
			}
			
			// $.ajax({
			// 				url: uri,
			// 				type: 'GET',
			// 				async: false,
			// 				success: function() {
			// 					// went through - fire event;
			// 					$("#validationImage").attr('src','images/001_06.png');
			// 					
			// 				}
			// 			});
		},
		getInputData = function() {
			// return either the value from textarea
			// or from the URI input depending on state of radio
			// buttons
			if($("option#RadioButtonText:selected").length) {
				return $("#BodyTextArea > textarea").val().trim();
			} else if($("option#RadioButtonURI:selected").length) {
				return $("#BodyURI > input").val().trim();
			}
		};
		
		
		that.ready(function() {
			$("#TargetURI > input").focusout(function(e) {
				e.preventDefault();
				validate($(this).val());
				
			});
			
			// Application and viewSetup are complete; setting up
			// callback functions
			$("#submitAnno").click(function(e) {
				e.preventDefault();
				// check if there already exists Annos with
				// this data
				
				var item = getInputData(), 
				duplicateSearch = that.dataStore.MM.prepare([".uri"]), uris = [],
				targetURI = $("#TargetURI > input").val();
				
				// check if there is an already existing URI in store
				uris = duplicateSearch.evaluate([targetURI]);
				if(uris.size > 1) {
					// already present
				} else {
					// get datestamp
					var d = new Date(), 
					timestamp = 'time:'+d.getMonth()+':'+d.getDate()+'::'+d.getHours()+':'+d.getMinutes();
					
					// prepare data
					var annoData = {
						id: 'madeupID',
						type: 'annotation',
						created: timestamp,
						hasBody: item,
						hasTarget: targetURI
					};
					that.dataStore.MM.loadItems([annoData]);
					// push to server
					return;
					
					$.ajax({
						url: 'urltoservice',
						type: 'POST',
						data: annoData,
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
	
	
	
	
})(jQuery, MITHGrid);

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
			dataStore: 'MM',
			filters: [".data='uri'"]
		},
		// Body objects that are referenced by text that a user
		// enters into the textarea
		TextBody: {
			label: "TextBody",
			types: ["body"],
			dataStore: 'MM',
			filters: [".data='text'"]
		},
		// All target objects. Will expand into targets referencing
		// other Annotations.
		TargetURI: {
			label: "TargetURI",
			types: ["target"],
			dataStore: 'MM'
		},
		// Resulting annotations minted by the MM service
		AnnotationDisp: {
			label: 'AnnoDisp',
			types: ["annotation"],
			dataStore: 'MM'
		}
	}
});