import { useCallback } from 'react'
import { useExportSnippetMutation } from '@/service/use-snippets'
import { downloadBlob } from '@/utils/download'

type UseSnippetDSLOptions = {
  snippetId: string
  snippetName: string
}

export const useSnippetDSL = ({ snippetId, snippetName }: UseSnippetDSLOptions) => {
  const exportSnippetMutation = useExportSnippetMutation()

  const handleExportDSL = useCallback(
    async (include = false, workflowId?: string) => {
      try {
        const data = await exportSnippetMutation.mutateAsync({
          snippetId,
          include,
          workflowId,
        })
        const file = new Blob([data], { type: 'application/yaml' })
        downloadBlob({ data: file, fileName: `${snippetName}.yml` })
      } catch {
        // The request layer reports this failure. Keep the current UI state.
      }
    },
    [exportSnippetMutation, snippetId, snippetName],
  )

  return { handleExportDSL }
}
