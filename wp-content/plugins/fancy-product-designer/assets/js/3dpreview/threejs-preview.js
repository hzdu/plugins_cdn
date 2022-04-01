import FPD3DPreview from './FPD3DPreview.js';

jQuery(document).ready(function($) {

    var fpd3DPreview,
        canvasW = 150,
        canvasH = 150,
        modelConfig,
        $fpd3DPreview = $('<div id="fpd-3d-preview" class="fpd-3d-preview-wrapper"><div class="fpd-loading">Loading...</div><div class="fpd-touch-info"></div></div>');

    if(fpd3dPreviewConfig.placement == 'designer') {
	    $fpd3DPreview
	    .append('<div class="fpd-fullscreen-toggle"><span class="fpd-icon-fullscreen"></span><span class="fpd-icon-fullscreen-close"></span></div>');
    }

    var _drawImageOnModel = function() {

		if (fancyProductDesigner.productCreated && fpd3DPreview && fpd3DPreview.modalCreated) {

			var options = {
			    onlyExportable: Boolean(modelConfig.only_exportable),
			    format: 'png'
			};

			var padding = modelConfig.print_padding ? Number(modelConfig.print_padding) : 0;

			if (fancyProductDesigner.currentViewInstance.options.printingBox) {

			    options.left = fancyProductDesigner.currentViewInstance.options.printingBox.left - padding;
			    options.top = fancyProductDesigner.currentViewInstance.options.printingBox.top - padding;
			    options.width = fancyProductDesigner.currentViewInstance.options.printingBox.width + (padding*2);
			    options.height = fancyProductDesigner.currentViewInstance.options.printingBox.height + (padding*2);

			}

			fancyProductDesigner.currentViewInstance.toDataURL(function(base64Data) {

			    fpd3DPreview.loadBase64(base64Data, fancyProductDesigner.currentViewIndex);

			}, 'transparent', options, null, false)

		}

    };

	$selector.on('click touchend', '.fpd-3d-preview-wrapper .fpd-fullscreen-toggle', function() {

		if(fpd3DPreview && fpd3DPreview.modalCreated) {

			var width = canvasW,
	            height = canvasH;

	        $fpd3DPreview.toggleClass('fpd-fullscreen');

	        if($fpd3DPreview.hasClass('fpd-fullscreen')) {
	            width = fancyProductDesigner.$mainWrapper.width();
	            height = fancyProductDesigner.$mainWrapper.height();
	        }

	        $fpd3DPreview.css({
	            width: width,
	            height: height
	        });
	        fpd3DPreview.setSize(width*2, height*2);

	        fancyProductDesigner.deselectElement();

		}

    })
	.on('viewCanvasUpdate elementSelect', _drawImageOnModel)
    .on('productCreate', function() {

        if(!fpd3DPreview && fancyProductDesigner.currentViewInstance.options.threeJsPreviewModel) {

            var modelDir = fancyProductDesigner.currentViewInstance.options.threeJsPreviewModel;

            $.getJSON(fpd3dPreviewConfig.path+modelDir+'/config.json', (mc) => {

	            modelConfig = mc;

	        	if(modelConfig && modelConfig.id) {

		        	if(fpd3dPreviewConfig.placement == 'designer') {

		                $fpd3DPreview.css({
		                    width: canvasW,
		                    height: canvasH
		                });

		                fancyProductDesigner.$mainWrapper.append($fpd3DPreview);

		            } else {

						var $placeholder = $('#fpd-3d-preview-placeholder');

						if($placeholder.length == 0) {return;}

		                $placeholder.append($fpd3DPreview);

		                canvasW = $placeholder.width();
		                canvasH = $placeholder.height();

		                $fpd3DPreview.css({
		                    width: canvasW,
		                    height: canvasH
		                });

						canvasW = canvasW * 2;
						canvasH = canvasH * 2;
		            }

		            fpd3DPreview = new FPD3DPreview('fpd-3d-preview', {
		                width: canvasW,
		                height: canvasH,
		                imgPath: fpd3dPreviewConfig.path+modelDir+'/',
		                modelPath: fpd3dPreviewConfig.path+modelDir+'/',
		                modelFilename: 'model.fbx',
		                cameraZ: modelConfig.camera_z,
		                baseMaterialMetalness: modelConfig.base_material_metalness,
		                baseMaterialRoughness: modelConfig.base_material_roughness,
		                modalLoad: _drawImageOnModel
		            });

	        	}

            })

        }

    })

});