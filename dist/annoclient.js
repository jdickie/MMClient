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
* Currently this is being only implemented to handle registration of a particular annotation to the server. 
*  
*/

var MITHGrid = MITHGrid || {};
var jQuery = jQuery || {};
var Interedition = Interedition || {};
var app = app || {};

MITHGrid.globalNamespace('Interedition');
Interedition.namespace('Client');
Interedition.Client.namespace('AnnotationRegistration');
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
(function($, MITHGrid) {
    var author_uri = 'Grant',
    post_body_uri = 'http://87.106.12.254:3000/annotation_bodies',
    post_anno_uri = 'http://87.106.12.254:3000/annotations.json',
    constrain_anno_uri = 'http://87.106.12.254:8182/oac-constraint/create',
    constrain_anno_match_uri = 'http://87.106.12.254:8182/oac-constraint/match',
    phpCDBypass = 'src/callServer.php',
    targetId = '',
    bodyId = 'http://interedition.performantsoftware.com/annotation_bodies/86';

    // Set up presentation layers
    MITHGrid.Presentation.namespace('TextArea');
    MITHGrid.Presentation.TextArea.initPresentation = function(container, options) {
        var that = MITHGrid.Presentation.initPresentation("MITHGrid.Presentation.TextArea", container, options),
        registerTarget;
        
        that.rangy = options.controllers.rangy.bind(container, {});
		that.server = options.controllers.server.bind(container, {});
		registerTarget = function(item) {
			var target, targetSearch, 
			targetIds;
			targetSearch = options.application.dataStores.MM.prepare(['.type']);
			targetIds = targetSearch.evaluate('Target');
			
			linepos = 'line=' + item.start + ',' + item.end;
            
            textURI = 'http://quartos.org/lib/XMLDoc/viewXML.php?path=ham-1604-22276x-fol-c01.xml';
            // convert item to constrain object
            cObj = {
                uri: textURI,
                constraint: {
                    position: linepos
                }
            };
			
			target = {
				id: 'target' + targetIds.length,
				type: 'Target',
				hasConstraint: item.hasConstraint || '',
				bodyType: 'text',
				bodyContent: item.hasContent
			};
			options.application.dataStores.MM.loadItems([target]);
		};
		
		that.rangy.events.onMouseUp.addListener(registerTarget);
        return that;
    };

    MITHGrid.Presentation.namespace('AnnoView');
    MITHGrid.Presentation.AnnoView.initPresentation = function(container, options) {
        var that = MITHGrid.Presentation.initPresentation("MITHGrid.Presentation.AnnoView", container, options);

        return that;
    };

    // MMClient Application - sets up HTML for interface and provides data callback functions
	Interedition.Client.AnnotationRegistration.namespace('MMClient');
    Interedition.Client.AnnotationRegistration.MMClient.initApp = function(container, options) {
        app = MITHGrid.Application.initApp("Interedition.Client.AnnotationRegistration.MMClient", container, $.extend(true, {},
        options, {
            viewSetup: '<div id="annoRegisterForm">' +
            '<div id = "TargetDiv">' +
            '<h2>Anno Target :</h2><br/>' +
            '<div id="textBodyTarget"></div>	' +
            '<div id="targetLoadTable"></div>' +
            '</div>' +
            '<div id="BodyTextArea">' +
            '<h3>Put your annotation text here</h3>' +
            '<div id="targetID"></div>' +
            '<textarea id="bodyContent" cols="55" rows="20"></textarea>' +
            '<br/>' +
            '<button id="bodyLoad">Load Body</button>' +
            '<div id="bodyLoadTable"></div>' +
            '</div>' +
            '<div id="AnnoArea">' +
            '	<button id="submitAnno">Submit Annotation</button>	' +
            '<div id="annotationTable">' +
            '<ul>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="servermessage"></div>',
            // dataStoreDisplay is for debugging
            presentations: {
                TextAreaContent: {
                    type: MITHGrid.Presentation.TextArea,
                    container: "#textBodyTarget",
                    dataView: "TextContent",
                    lenses: {
                        text: function(container, view, model, itemId) {
                            var that = {},
                            item = model.getItem(itemId);

                            // render item as UTF-8 in textarea
                            container.empty().append('<p>' + item.content + '</p>');
                            return that;
                        }
                    },
					controllers: {
						rangy: "rangy",
						server: "server"
					}
                },
                AnnoDisp: {
                    type: MITHGrid.Presentation.AnnoView,
                    container: "#bodyLoadTable",
                    dataView: 'AnnotationDisp',
                    lenses: {
                        annotation: function(container, view, model, itemId) {
                            var that = {},
                            item = model.getItem(itemId),
                            el = '<li>',
                            anno,
                            target,
                            body;

                            el += '<p>' + item.id[0] + '</p>' +
                            '<p>' + item.hasBody[0] + '</p>' +
                            '<p>' + item.hasTargets[0] + '</p>' +
                            '</li>';

                            $("#" + $(container).attr('id') + " > ul").append(el);
                            // get target and body items
                            target = model.getItem(item.hasTargets[0]);


                            // prep for server/convert data
                            anno = {
                                author_uri: author_uri,
                                body_uri: item.hasBody[0],
                                targets: [{
                                    uri: target.uri[0],
                                    constraint: target.constraint[0]
                                }]
                            };

                            sendAnnoRequest(anno);

                            that.update = function(item) {
                                el += '<p>' + item.id[0] + '</p>' +
                                '<p>' + item.hasBody[0] + '</p>' +
                                '<p>' + item.hasTargets[0] + '</p>' +
                                '</li>';

                                $("#" + $(container).attr('id') + " > ul").append(el);
                                // get target and body items
                                target = model.getItem(item.hasTargets[0]);

                                // prep for server/convert data
                                anno = {
                                    author_uri: author_uri,
                                    body_uri: item.hasBody[0],
                                    targets: [{
                                        uri: target.id[0],
                                        constraint: target.constraint[0]
                                    }]
                                };
                                sendAnnoRequest(anno);
                            };

                            return that;
                        }
                    }
                }
            }

        }));



        app.validate = function(uri) {
            if (! (/^http/.test(uri))) {
                $("#validationImage").attr('src', 'images/001_05.png');
            } else {
                // went through - fire event;
                $("#validationImage").attr('src', 'images/001_06.png');
            }
        };

        app.getBodyContent = function() {
            // return either the value from textarea
            // or from the URI input depending on state of radio
            // buttons
            return $("#BodyTextArea > textarea").text();
        };
        app.getBodyURI = function(bodyObj) {
            // Takes a Body object and returns the unique
            // URI after sending it to client via POST
            // send body object
            $.ajax({
                url: post_body_uri,
                data: bodyObj,
                type: 'POST',
                dataType: 'text',
                success: function(u, stat, xhr) {
                    // display in the correct success div
                    // for body tags
                    var uriPage = u,
                    start,
                    end;
                    start = uriPage.indexOf('<body>');
                    uriPage = uriPage.substring(start);
                    end = uriPage.indexOf('</b');
                    bodyId = uriPage.substring(0, end);
                    bodyId = bodyId.replace(/\<body\>/, '');
                    // \n\nhttp://interedition.performantsoftware.com/annotation_bodies/56\n\n
                    bodyId = bodyId.replace(/\n+/, '');
                    bodyId = bodyId.replace(/\n+/, '');
                    $.extend(bodyObj, {
                        id: bodyId,
                        type: 'body',
                        uri: bodyId
                    });

                    // insert into datastore
                    app.dataStore.MM.loadItems([bodyObj]);
                }
            });
        };

        app.parseExportAnno = function(anno) {
            // take a local data store copy of an annotation,
            // parse it into client-friendly JSON, then return
            var result = {},
            body = {},
            targets = [],
            t = {};
            // get body and target(s)
            body = app.dataStore.MM.getItem(anno.hasBody);

            $.each(anno.hasTarget,
            function(i, o) {
                t = app.dataStore.MM.getItem(o);
                targets.push(t);
            });

            result = {
                body: body,
                targets: targets,
                author_uri: author_uri
            };

            return result;

        };

        app.parseInputAnno = function(annoURI, anno) {
            // Returns a flattened JSON version of returned
            // OAC annotation for the MITHGrid data store
            var base = anno.annotation,
            body = {},
            target = {},
            targets = [],
            mgridanno = {
                id: annoURI,
                type: 'annotation',
                hasBody: '',
                hasTarget: [],
                created: ''
            };

            $.each(base.annotation_body,
            function(i, o) {
                mgridanno.hasBody = o.uri;
                mgridanno.created = o.created_at;

                body = {
                    id: o.uri,
                    type: 'body',
                    created: o.created_at,
                    updated: (o.updated_at) ? o.updated_at: ''
                };
            });

            $.each(base.annotation_target_instances,
            function(i, o) {
                $.each(o.annotation_instance,
                function(x, y) {
                    mgridanno.hasTarget.push(y.annotation_target_info.uri);

                    target = {
                        id: y.annotation_target_info.uri,
                        type: 'target',
                        mime_type: y.annotation_target_info.mime_type
                    };
                    if (y.annotation_constraint !== undefined) {
                        $.each(y.annotation_constraint,
                        function(ci, co) {
                            // add constraint to object
                            target[ci] = co;
                        });
                    }

                    targets.push(target);
                });
            });
        };

        // Checks for other target objects of similar origin
        app.checkHasTarget = function(uri) {
            var target = {},
            targetRecs = app.dataStore.MM.prepare(["target.uri"]),
            collect = targetRecs.evaluate([uri]);

            if (collect.length) {
                // return current record
                } else {
                // if new, create new record and return
                }

        };

        app.getTargetSelection = function(e, text, targetURI, constraint) {
            // callback for the TargetTextSelected event
            // Retrieves the text the user selects and inputs
            // into the data store
            var targetObj = {},
            targets,
            query = app.dataStore.MM.prepare([".type='target'"]);
            targets = query.length;
            targetId = 't' + (Math.ceil(Math.random() * 100));

            targetObj = {
                id: targetId,
                uri: targetURI,
                type: 'target',
                content: text,
                mime_type: "text/html",
                constraint: constraint.constraint
            };
            app.dataStore.MM.loadItems([targetObj]);
        };

        // Registers an OAC-annotation constraint from
        // a text selection
        app.registerConstraint = function(e, sel, start, end) {
            var cObj = {},
            linepos = 'line=' + start + ',' + end,
            ranges = sel.getAllRanges(),
            txt = sel.toString(),
            textItem = app.dataStore.MM.prepare(['.type="text"']),
            textURI = 'http://quartos.org/lib/XMLDoc/viewXML.php?path=ham-1604-22276x-fol-c01.xml';
            // convert item to constrain object
            cObj = {
                uri: textURI,
                constraint: {
                    position: linepos
                }
            };
            // call constraint service
            $.ajax({
                url: phpCDBypass,
                type: 'POST',
                dataType: 'text',
                data: {
                    urlsend: constrain_anno_uri,
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

                    console.log('success reached ' + constraint);


                    $("body:first").trigger("TargetTextParsed", [txt, textURI, JSON.parse(constraint)]);
                },
                complete: function(xhr, status) {
                    console.log(xhr);
                }
            });
        };

        app.ready(function() {
            $("#TargetURI > input").focusout(function(e) {
                e.preventDefault();
                validate($(this).val());

            });

            // Global bind
            // Load the target object into Data Store
            // $("body").bind("TargetTextSelected", registerConstraint);
            // $("body").bind("TargetTextParsed", getTargetSelection);
            $("#servermessage").bind("ajaxStart",
            function() {
                // adjust scrolltop
                var top = parseInt($(this).css('top'), 10);
                $(this).css('top', (top + $(document).scrollTop()));
                $(this).empty().append('<p>Loading...</p>').show();
            });

            $("#servermessage").bind("ajaxComplete",
            function() {

                $(this).empty().hide();
            });

            // Load the Body object in order to get back a unique
            // URI value
            $("#bodyLoad").click(function(e) {
                e.preventDefault();
                
                var bodyContent = getBodyContent(),
                body_mime = 'text/html';

                // get body URI
                bodyObj = {
                    "content": bodyContent,
                    "mime_type": body_mime
                };

                var uriBody = getBodyURI(bodyObj);

            });

            // Application and viewSetup are complete; setting up
            // callback functions
            $("#submitAnno").click(function(e) {
                e.preventDefault();

                // get datestamp
                var d = new Date(),
                timestamp = 'time:' + d.getMonth() + ':' + d.getDate() + '::' + d.getHours() + ':' + d.getMinutes();

                // prepare data
                var annoData = {
                    id: 'madeupID',
                    type: 'annotation',
                    created: timestamp,
                    hasBody: bodyId,
                    hasTargets: [targetId]
                };
                app.dataStore.MM.loadItems([annoData]);
                // push to server
                return;
            });

            // Load in sample text for Target area
            app.dataStore.MM.loadItems([{
                id: 'http://quartos.org/lib/XMLDoc/viewXML.php?path=ham-1604-22276x-fol-c01.xml',
                type: 'text',
                content: 'King.' +
                'And now princely Sonne Hamlet ,  				' +
                'Exit.  ' +
                'What meanes these sad and melancholy moodes?' +
                'For your intent going to Wittenberg ,' +
                'Wee hold it most vnmeet and vnconuenient,' +
                'Being the Ioy and halfe heart of your mother.' +
                'Therefore let mee intreat you stay in Court,' +
                'All Denmarkes hope our coosin and dearest Sonne.' +
                'Ham.' +
                'My lord, tis not the sable sute I weare:' +
                'No nor the teares that still stand in my eyes,' +
                'Nor the distracted hauiour in the visage,' +
                'Nor all together mixt with outward semblance,' +
                'Is equall to the sorrow of my heart,' +
                'Him haue I lost I must of force forgoe,' +
                'These but the ornaments and sutes of woe.' +
                'King' +
                'This shewes a louing care in you, Sonne Hamlet ,' +
                'But you must thinke your father lost a father,' +
                'That father dead, lost his, and so shalbe vntill the' +
                'Generall ending. Therefore cease laments,' +
                'It is a fault gainst heauen, fault gainst the dead,' +
                'A fault gainst nature, and in reasons' +
                'Common course most certaine,'
            }
            //,{"type":"body","id":"http://interedition.performantsoftware.com/annotation_bodies/86","content":"","mime_type":"text/html","uri":"http://interedition.performantsoftware.com/annotation_bodies/86"}
            ]);


        });

        return app;
    };




})(jQuery, MITHGrid);
/* 
Custom defaults for Application Registration
*/

MITHGrid.defaults("Interedition.Client.AnnotationRegistration.Controller.Rangy", {
	bind: {
		events: {
			onMouseUp: null,
			onMouseDown: null
		}
	}
});


// Defaults that are common for the entire application
MITHGrid.defaults("Interedition.Client.AnnotationRegistration.MMClient", {
	controllers: {
		rangy: {
			type: Interedition.Client.AnnotationRegistration.Controller.Rangy,
			selectors: {
				doc: ''
			}
		},
		server: {
			type: Interedition.Client.AnnotationRegistration.Controller.Server,
			selectors: {
				
			}
		}
	},
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
				bodyType: {
					valueType: 'text'
				},
				bodyContent: {
					valueType: 'text'
				},
				targetURI: {
					valueType: 'uri'
				},
				constraintURI: {
					valueType: 'uri'
				},
				bodyURI: {
					valueType: 'uri'
				}
            }
        }
    },
    dataViews: {
        // Viewing only the text to be inserted into a textarea
        TextContent: {
            types: ['text'],
            dataStore: 'MM'
        },
        // Body objects that are referenced by text that a user
        // enters into the textarea
        TextBody: {
            types: ["body"],
            dataStore: 'MM'
        },
        // All target objects. Will expand into targets referencing
        // other Annotations.
        TargetURI: {
            types: ["target"],
            dataStore: 'MM'
        },
        // Resulting annotations minted by the MM service
        AnnotationDisp: {
            types: ["annotation"],
            dataStore: 'MM'
        }
    }
});

// End of Interedition MM Client

// @author Grant Dickie