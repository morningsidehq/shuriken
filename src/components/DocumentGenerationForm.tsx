'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { processDocument } from '@/utils/documentProcessing'

interface GeneratedDocument {
  id: string
  title: string
  url: string
  timestamp: Date
  documentType: string
  format: string
}

interface GenerationTab {
  id: string
  title: string
  documents: GeneratedDocument[]
}

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  instructions: z
    .string()
    .min(10, 'Instructions must be at least 10 characters'),
  context: z.string().optional(),
  format: z.enum(['docx', 'pdf', 'csv'], {
    required_error: 'Please select a file format',
  }),
  documentType: z.string().min(1, 'Document type is required'),
  documentDate: z.date().optional(),
})

export default function DocumentGenerationForm({
  userGroup,
  userId,
}: {
  userGroup: string
  userId: string
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [tabs, setTabs] = useState<GenerationTab[]>([
    { id: '1', title: 'Generation 1', documents: [] },
  ])
  const [activeTab, setActiveTab] = useState('1')
  const [selectedDocument, setSelectedDocument] =
    useState<GeneratedDocument | null>(null)
  const [uploadingDocIds, setUploadingDocIds] = useState<Set<string>>(new Set())
  const [blobUrls] = useState<Set<string>>(new Set())

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instructions: '',
      context: '',
      title: '',
      format: 'pdf',
      documentType: 'report',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      const formData = {
        title: values.title,
        instructions: values.instructions,
        context: values.context || '',
        format: values.format,
        document_type: values.documentType,
        document_date:
          values.documentDate?.toISOString() || new Date().toISOString(),
        user_group: userGroup,
        user_id: userId,
        metadata: {
          user_group: userGroup,
          user_id: userId,
        },
      }

      console.log('Submitting document generation request:', formData)

      const response = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Document generation error details:', errorData)
        throw new Error(
          errorData.error || errorData.message || 'Failed to generate document',
        )
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      blobUrls.add(url)

      // Update the documents list with the new document
      const newDocument: GeneratedDocument = {
        id: crypto.randomUUID(),
        title: values.title,
        url,
        timestamp: new Date(),
        documentType: values.documentType,
        format: values.format,
      }

      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === activeTab
            ? { ...tab, documents: [...tab.documents, newDocument] }
            : tab,
        ),
      )

      setSelectedDocument(newDocument)
      toast({
        title: 'Document generated successfully',
        description: 'Your document is ready to view',
      })
    } catch (error) {
      console.error('Error generating document:', error)
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to generate document. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addNewTab = () => {
    const newId = (Math.max(...tabs.map((t) => parseInt(t.id))) + 1).toString()
    setTabs((prev) => [
      ...prev,
      { id: newId, title: `Generation ${newId}`, documents: [] },
    ])
    setActiveTab(newId)
  }

  const handleUploadToLibrary = async (doc: GeneratedDocument) => {
    try {
      setUploadingDocIds((prev) => new Set(prev).add(doc.id))

      // Create a copy of the blob from the existing URL
      const response = await fetch(doc.url)
      if (!response.ok) {
        throw new Error('Failed to access document data')
      }

      const blob = await response.blob()
      const file = new File([blob], `${doc.title}.${doc.format}`, {
        type:
          doc.format === 'pdf' ? 'application/pdf' : 'application/octet-stream',
      })

      await processDocument(file, () => {}, userId, doc.title, '', userGroup)

      toast({
        title: 'Success',
        description: 'Document uploaded to library successfully',
      })
    } catch (error) {
      console.error('Error uploading to library:', error)
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to upload document',
        variant: 'destructive',
      })
    } finally {
      setUploadingDocIds((prev) => {
        const next = new Set(prev)
        next.delete(doc.id)
        return next
      })
    }
  }

  useEffect(() => {
    // Cleanup function that runs when component unmounts
    return () => {
      blobUrls.forEach((url) => {
        URL.revokeObjectURL(url)
      })
    }
  }, [blobUrls])

  return (
    <div className="container mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button variant="outline" onClick={addNewTab}>
            New Generation
          </Button>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-4">
            <Card className="border-border">
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Document Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter document title"
                                {...field}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="documentType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Document Type</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <option value="">Select a document type</option>
                                <option value="minutes">Minutes</option>
                                <option value="agenda">Agenda</option>
                                <option value="press-release">
                                  Press Release
                                </option>
                                <option value="receipt">Receipt</option>
                                <option value="permit">Permit</option>
                                <option value="contract">Contract</option>
                                <option value="memo">Memo</option>
                                <option value="proposal">Proposal</option>
                                <option value="invoice">Invoice</option>
                                <option value="sow">
                                  Statement of Work (SOW)
                                </option>
                                <option value="report">Report</option>
                                <option value="policy">Policy Document</option>
                                <option value="loi">
                                  Letter of Intent (LOI)
                                </option>
                                <option value="mou">
                                  Memorandum of Understanding (MOU)
                                </option>
                                <option value="certificate">Certificate</option>
                                <option value="permit-application">
                                  Permit Application
                                </option>
                                <option value="work-order">Work Order</option>
                                <option value="press-briefing">
                                  Press Briefing Note
                                </option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="context"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Search Context</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe the type of documents you want to reference..."
                                className="min-h-[100px]"
                                maxLength={500}
                                {...field}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Maximum 500 characters
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="instructions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Generation Instructions</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Provide specific instructions for generating your document..."
                                className="min-h-[100px]"
                                {...field}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="documentDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Document Date/Time (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                type="datetime-local"
                                {...field}
                                value={
                                  field.value
                                    ? (field.value as Date)
                                        .toISOString()
                                        .slice(0, 16)
                                    : ''
                                }
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? new Date(e.target.value)
                                      : undefined,
                                  )
                                }
                                disabled={isLoading}
                              />
                            </FormControl>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Leave blank to use current date/time
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="format"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>File Format</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <option value="">Select a format</option>
                                <option value="docx">
                                  Word Document (.docx)
                                </option>
                                <option value="pdf">PDF Document (.pdf)</option>
                                <option value="csv">
                                  CSV Spreadsheet (.csv)
                                </option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        'Generate Document'
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {tab.documents.length > 0 && (
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <h3 className="mb-4 text-lg font-semibold">
                    Generated Documents
                  </h3>
                  <div className="space-y-4">
                    {tab.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div>
                          <p className="font-medium">{doc.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.documentType} •{' '}
                            {doc.timestamp.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUploadToLibrary(doc)}
                            disabled={uploadingDocIds.has(doc.id)}
                          >
                            {uploadingDocIds.has(doc.id) ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              'Upload to Library'
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDocument(doc)}
                          >
                            View Document
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <Dialog
        open={!!selectedDocument}
        onOpenChange={() => {
          setSelectedDocument(null)
        }}
      >
        <DialogContent className="h-[90vh] max-w-[45vw] gap-0 p-0">
          <DialogHeader className="px-4 py-2">
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedDocument?.title}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (selectedDocument) {
                    const a = document.createElement('a')
                    a.href = selectedDocument.url
                    a.download = `${selectedDocument.title}.${selectedDocument.format}`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                  }
                }}
              >
                Download
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="relative h-full w-full">
              {selectedDocument.format === 'pdf' ? (
                <iframe
                  src={selectedDocument.url}
                  className="h-[calc(90vh-3rem)] w-full"
                  title="Document Viewer"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">
                    Preview not available for{' '}
                    {selectedDocument.format.toUpperCase()} files. Please use
                    the download button above.
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
