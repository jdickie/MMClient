

(function() {
	MITHGrid.Application.namespace('MMClient');
	MITHGrid.Application.MMClient.initApp = function(container, options) {
		var that = MITHGrid.Application.initApp("MITHGrid.Application.Canvas", container, $.extend(true, {}, options, {
			viewSetup: '',
			presentations: {
				type: MITHGrid.Presentation.RaphSVG,
				container: "#bodyURI",
				dataView: 'MM',
				lenses: {
					body: function(container, view, model, itemId) {
						// Receives all BODY URI objects 
						
					}
				}
			}
		})),
		validate = function() {
			
		};
		
		return that;
	};
	
	// Defaults that are common for the entire application
	
	MITHGrid.defaults("MITHGrid.Application.MMClient", {
	
		dataStores: {
			// Defining what we kind of Object schema we expect from the 
			// service
			MM: {
				annotation: {},
				body: {},
				target: {}
			}
		},
		dataViews: {
			URIBody: {
				label: "URIBody",
				types: ["body"],
				dataStore: MM,
				filters: [".uri"]
			},
			TextBody: {
				label: "TextBody",
				types: ["body"],
				dataStore: MM,
				filters: [".text"]
			},
			TargetURI: {
				label: "TargetURI",
				types: ["target"],
				dataStore: MM
			},
			AnnotationDisp: {
				label: 'AnnoDisp',
				types: ["annotation"],
				dataStore: MM
			}
		}
	});
	
	
});