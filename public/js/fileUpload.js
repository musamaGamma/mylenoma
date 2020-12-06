


    FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginImageResize,
        FilePondPluginFileEncode
    
    )
    FilePond.setOptions(
        {
            stylePanelAspectRatio: 1 / 0.75,
            imageResizeTargetWidth: 200,
            imageResizeTargetHeight: 200 / 0.75
        }
    )
    FilePond.parse(document.body);

