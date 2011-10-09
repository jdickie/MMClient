/*
* MM Client Front-End
* 
* @author: Grant Dickie
* 
* Uses MITHGrid - (c) 2011 MITH
* 
* This is a MITHGrid application of the OAC Annotation Repository framework produced by Asaf Bartov, Moritz Wissenbach,
* Marco Petris, and fellow from the University of Madrid. The server stores annotations and allows for querying across
* the already stored annotations with REST calls. Each Annotation, Body, and Target are given REST paths once stored
* at the server level. They can be retrieved using these calls. Note: the Ruby server returns a status of 302 when an
* annotation is successfully stored.
* 
* Locally, all annotations for a particular target are stored in the MITHGrid datastore. When a user enters a new 
* Target path, the annotations for that Target are automatically queried and retrived from the server via REST and
* put into the local data store in order to be queried against locally and provide faster service. Further use cases
* should be considered, where a user wants to query against more than just annotations on a the given Target.  
* 
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
				// URIBody: {
				// 				type: MITHGrid.Presentation.URIRender,
				// 				container: "#BodyURI > #bodyDisplay",
				// 				dataView: 'URIBody',
				// 				lenses: {
				// 					body: function(container, view, model, itemId) {
				// 						// Receives all BODY URI objects defined by a URI
				// 						var that = {}, 
				// 						el = $(container), item = model.getItem(itemId);
				// 						
				// 						// validate URI
				// 						// that.validate(item.uri[0]);
				// 						
				// 						return that;
				// 					}
				// 				}
				// 			},
				TextBodyDisp: {
					type: MITHGrid.Presentation.TextRender,
					container: "#BodyData",
					dataView: 'TextBody',
					lenses: {
						body: function(container, view, model, itemId) {
							// Receives Body objects that have mime type text/html
							var that = {};
							
							$("#targetarea").append("<p>URI retrieved for Body: "+uriBody);
							
							
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
		author_uri = 'Grant',
		post_body_uri = 'http://interedition.performantsoftware.com/annotation_bodies',
		post_anno_uri = 'http://interedition.performantsoftware.com/annotations',
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
			// if($("input[type=radio]:checked").length) {
				return $("#BodyTextArea > textarea").text();
			// } else if($("option#RadioButtonURI:selected").length) {
				// return $("#BodyURI > input").val();
			// }
		},
		getBodyURI = function(bodyObj) {
			// Takes a Body object and returns the unique
			// URI after sending it to client via POST
		console.log('sending to service: '+JSON.stringify(bodyObj));
			// send body object
			$.ajax({
				url: post_body_uri,
				data: bodyObj,
				type: 'GET',
				dataType: 'text',
				contentType: 'application/json',
				statusCode: {
					// returns a 302 call on success -
					// have to write in script for this
					302: function() {
						console.log('302 reached');
						// load into data store
						$.extend(body, {id: u});
						
						that.dataStore.MM.loadItems([body]);
					}
				}
			});
			
			
			
		},
		parseExportAnno = function(anno) {
			// take a local data store copy of an annotation,
			// parse it into client-friendly JSON, then return
			var result = {}, body = {}, targets = [], t = {};
			// get body and target(s)
			body = that.dataStore.MM.getItem(anno.hasBody);
			
			$.each(anno.hasTarget, function(i, o) {
				t = that.dataStore.MM.getItem(o);
				targets.push(t);
			});
			
			result = {
				body: body,
				targets: targets,
				author_uri: author_uri
			};
			
			return result;
			
		},
		parseInputAnno = function(annoURI, anno) {
			// Returns a flattened JSON version of returned
			// OAC annotation for the MITHGrid data store
			var base = anno.annotation, body = {}, target = {}, targets = [], 
			mgridanno = {
				id: annoURI,
				type: 'annotation',
				hasBody: '',
				hasTarget: [],
				created: ''
			};
			
			$.each(base.annotation_body, function(i,o) {
				mgridanno.hasBody = o.uri;
				mgridanno.created = o.created_at;
				
				body = {
					id: o.uri,
					type: 'body',
					created: o.created_at,
					updated: (o.updated_at) ? o.updated_at:''
				};
			});
			
			$.each(base.annotation_target_instances, function(i,o) {
				$.each(o.annotation_instance, function(x,y) {
					mgridanno.hasTarget.push(y.annotation_target_info.uri);
					
					target = {
						id: y.annotation_target_info.uri,
						type: 'target',
						mime_type: y.annotation_target_info.mime_type
					};
					if(y.annotation_constraint !== undefined) {
						$.each(y.annotation_constraint, function(ci,co) {
							// add constraint to object
							target[ci] = co;
						});
					}
					
					targets.push(target); 
				});
			});
		},
		// Checks to see if other annotations already exist
		checkAnnos = function(uri) {
			var duplicateSearch = that.dataStore.MM.prepare([".uri"]), uris = [];
			
		},
		// Checks for other target objects of similar origin
		checkHasTarget = function(uri) {
			var target = {}, targetRecs = that.dataStore.MM.prepare(["target.uri"]),
			collect = targetRecs.evaluate([uri]);
			
			if(collect.length) {
				// return current record
				
			} else {
				// if new, create new record and return
				
			}
			
		},
		// Check to see if a particular URI path relates to a 
		//  already checked-in Body
		checkHasBody = function(uri) {
			// checking against local data store 
		},
		getTargetAnnos = function(targetURI) {
			// retrieve all of the annotations 
			// associated with targetURI on server,
			// parse them, and load into data store
			var response = {}, annoTable = {};
			
			// get data from server - retrieve JSON (TODO)
			
			
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
				
				// var item = getInputData(), 
				// 				duplicateSearch = that.dataStore.MM.prepare([".uri"]), uris = [],
				// 				targetURI = $("#TargetURI > input").val();
				
				var bodyContent = getInputData(), body_mime = 'text/html';
				
				// get body URI
				bodyObj = {"content": bodyContent, "mime_type": body_mime};
				console.log('bodyObj: '+JSON.stringify(bodyObj));
				var uriBody = getBodyURI(bodyObj);
				
				
				return;
				
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
						contentType: 'application/json',
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
		// URIBody: {
		// 		label: "TextBody",
		// 		types: ["body"],
		// 		dataStore: 'MM',
		// 		filters: [".mime_type='text/html'"]
		// 	},
		// Body objects that are referenced by text that a user
		// enters into the textarea
		TextBody: {
			label: "TextBody",
			types: ["body"],
			dataStore: 'MM',
			filters: [".mime_type='text/html'"]
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