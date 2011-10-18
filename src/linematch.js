/*
* Matching lines between images and texts 
* Using MITHGrid presentations
*
*/

(function($, MITHGrid) {
	
	MITHGrid.Presentation.namespace("Manuscript");
	MITHGrid.Presentation.Manuscript = function(container, options) {
		var that = MITHGrid.Presentation.initPresentation("Manuscript", container, options);
		
		that.boundary = '<div id="manuscript_lines">'+
		'<ul>'+
		'</ul>'+
		'</div>';
		
		that.selfRender = function() {
			// render the area for where lines are inserted
			
			$(container).append(that.boundary);
			
		};
		
		return that;
	};
	
	
	MITHGrid.Application.Namespace('LineLink');
	MITHGrid.Application.LineLink.initApp = function(container, options) {
		var that = MITHGrid.Application.initApp("MITHGrid.Application.LineLink", container, $.extend(options, {
			viewSetup: '',
			presentations: {
				lines: {
					type: MITHGrid.Presentation.Manuscript,
					view: 'lineView',
					lenses: {
						
					}
				}
			}
		}));
	};
	
})(jQuery, MITHGrid);