'use client'

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // any additional props you have
}

export default function FileInput(props: FileInputProps) {
  return <input type="file" {...props} />
}
