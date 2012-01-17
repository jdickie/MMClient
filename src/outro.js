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
		},
		clickactive: {
			type: Interedition.Client.AnnotationRegistration.Controller.clickActive,
			selectors: {
				clickobject: '.targetItem'
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
        bodies: {
            types: ["body"],
            dataStore: 'MM'
        },
        // All target objects. Will expand into targets referencing
        // other Annotations.
        targets: {
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