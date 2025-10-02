import { RefObject } from 'react'
import { toPng } from 'html-to-image'

type UseCardExportParams = {
    exportRef: RefObject<HTMLDivElement | null>
    previewRef: RefObject<HTMLDivElement | null>
    exportImageLoaded: boolean
    width?: number
    height?: number
    pixelRatio?: number
}

export function useCardExport({
    exportRef,
    previewRef,
    exportImageLoaded,
    width = 1200,
    height = 800,
    pixelRatio = 4,
}: UseCardExportParams) {
    const getExportDataUrl = async (): Promise<string> => {
        const node = exportRef.current || previewRef.current
        if (!node) throw new Error('Preview is not ready')

        if (exportRef.current) {
            let tries = 0
            while (!exportImageLoaded && tries < 20) {
                // wait ~50ms up to ~1s
                // eslint-disable-next-line no-await-in-loop
                await new Promise(resolve => setTimeout(resolve, 50))
                tries += 1
            }
        }

        return await toPng(node, {
            cacheBust: true,
            backgroundColor: '#ffffff',
            pixelRatio,
            width,
            height,
            canvasWidth: width,
            canvasHeight: height,
        })
    }

    return { getExportDataUrl }
}


