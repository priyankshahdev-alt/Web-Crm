import { useEffect, useRef, useState } from 'react'
import {
  BoldIcon,
  Heading1Icon,
  ItalicIcon,
  Link2Icon,
  ListUnorderedIcon,
} from '../icons'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  ariaLabel?: string
}

type Command =
  | { cmd: 'bold' }
  | { cmd: 'italic' }
  | { cmd: 'formatBlock'; block: string }
  | { cmd: 'insertUnorderedList' }
  | { cmd: 'createLink' }

/**
 * Minimal rich text editor for program descriptions. Gives the admin bold,
 * italic, a heading, bullet lists and links — without ever showing raw HTML.
 * Content is stored as simple sanitized-on-render HTML in the program record.
 */
export function RichTextEditor({ value, onChange, ariaLabel }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [focused, setFocused] = useState(false)

  // Sync external value → editor only when it differs (e.g. after loading a
  // program), so typing is never interrupted by re-renders.
  useEffect(() => {
    const el = editorRef.current
    if (el && el.innerHTML !== value) {
      el.innerHTML = value || ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const exec = (command: Command) => {
    const el = editorRef.current
    if (!el) return
    el.focus()
    if (command.cmd === 'formatBlock') {
      document.execCommand('formatBlock', false, command.block)
    } else if (command.cmd === 'createLink') {
      if (!linkUrl.trim()) return
      const url = linkUrl.trim()
      const safeUrl = /^https?:\/\//i.test(url) || url.startsWith('/') ? url : `https://${url}`
      document.execCommand('createLink', false, safeUrl)
      setShowLinkInput(false)
      setLinkUrl('')
    } else {
      document.execCommand(command.cmd)
    }
    onChange(el.innerHTML)
  }

  const toolbarButton = (label: React.ReactNode, title: string, onClick: () => void) => (
    <button
      key={title}
      type="button"
      title={title}
      aria-label={title}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-md text-faint transition hover:bg-soft hover:text-ink"
    >
      {label}
    </button>
  )

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white shadow-sm transition-colors ${
        focused ? 'border-brand focus-within:ring-2 focus-within:ring-brand/20' : 'border-line'
      }`}
    >
      <div className="flex flex-wrap items-center gap-0.5 border-b border-line bg-slate-50 px-2 py-1.5">
        {toolbarButton(<BoldIcon className="h-4 w-4" />, 'Bold', () => exec({ cmd: 'bold' }))}
        {toolbarButton(<ItalicIcon className="h-4 w-4" />, 'Italic', () => exec({ cmd: 'italic' }))}
        <span className="mx-1 h-4 w-px bg-line" />
        {toolbarButton(
          <Heading1Icon className="h-4 w-4" />,
          'Heading',
          () => exec({ cmd: 'formatBlock', block: 'h3' }),
        )}
        {toolbarButton(
          <span className="text-xs font-semibold">Body</span>,
          'Normal text',
          () => exec({ cmd: 'formatBlock', block: 'p' }),
        )}
        <span className="mx-1 h-4 w-px bg-line" />
        {toolbarButton(
          <ListUnorderedIcon className="h-4 w-4" />,
          'Bullet list',
          () => exec({ cmd: 'insertUnorderedList' }),
        )}
        {toolbarButton(<Link2Icon className="h-4 w-4" />, 'Add link', () => setShowLinkInput((v) => !v))}
      </div>
      {showLinkInput ? (
        <div className="flex items-center gap-2 border-b border-line bg-brand-soft/30 px-3 py-2">
          <input
            autoFocus
            type="text"
            value={linkUrl}
            placeholder="Paste a link, e.g. /donate or https://…"
            onChange={(event) => setLinkUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                exec({ cmd: 'createLink' })
              }
            }}
            className="h-8 flex-1 rounded-lg border border-line bg-white px-2.5 text-sm text-ink focus:border-brand focus:outline-none"
          />
          <button
            type="button"
            className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-strong"
            onClick={() => exec({ cmd: 'createLink' })}
          >
            Apply
          </button>
        </div>
      ) : null}
      <div
        ref={editorRef}
        role="textbox"
        aria-multiline="true"
        aria-label={ariaLabel ?? 'Description'}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          setFocused(false)
          onChange(event.currentTarget.innerHTML)
        }}
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
        onPaste={(event) => {
          // Paste as plain text so hidden formatting/code never sneaks in.
          event.preventDefault()
          const text = event.clipboardData.getData('text/plain')
          document.execCommand('insertText', false, text)
        }}
        className="prose-sm min-h-[140px] max-h-[420px] overflow-y-auto px-3.5 py-3 text-sm leading-relaxed text-ink outline-none [&_a]:text-brand [&_a]:underline [&_h3]:mb-1 [&_h3]:mt-2 [&_h3]:text-base [&_h3]:font-bold [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-2 [&_ul]:list-disc"
      />
    </div>
  )
}
