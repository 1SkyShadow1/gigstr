import { supabase } from '@/integrations/supabase/client'

export async function uploadFileToBucket(options: {
  bucket: string
  file: File
  folder?: string
  onProgress?: (percent: number) => void
}): Promise<{ url: string; path: string }> {
  const { bucket, file, folder, onProgress } = options
  const fileName = `${Date.now()}-${file.name}`
  const path = folder ? `${folder}/${fileName}` : fileName

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      onUploadProgress: (evt) => {
        if (!onProgress || !evt.total) return
        const percent = Math.round((evt.loaded / evt.total) * 100)
        onProgress(percent)
      },
    })

  if (error || !data) {
    throw new Error(error?.message || 'Upload failed')
  }

  const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(data.path)
  if (!publicUrl?.publicUrl) {
    throw new Error('Unable to retrieve public URL after upload')
  }

  return { url: publicUrl.publicUrl, path: data.path }
}
