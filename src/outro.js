/* 
Custom defaults for Application Registration
*/

MITHGrid.defaults("Interedition.Client.AnnotationRegistration.Rangy", {
	bind: {
		events: {
			onMouseUp: null,
			onMouseDown: null
		}
	}
});


// Defaults that are common for the entire application
MITHGrid.defaults("Interedition.Client.AnnotationRegistration.Application.MMClient", {

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
        // Viewing only the text to be inserted into a textarea
        TextContent: {
            label: 'TextContent',
            types: ['text'],
            dataStore: 'MM'
        },
        // Body objects that are referenced by text that a user
        // enters into the textarea
        TextBody: {
            label: "TextBody",
            types: ["body"],
            dataStore: 'MM'
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

// End of Interedition MM Client

// @author Grant Dickie