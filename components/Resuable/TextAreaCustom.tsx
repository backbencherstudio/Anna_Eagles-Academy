import React, { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Bold, Italic, Underline, Link, List, AlignLeft, AlignCenter, AlignRight, AlignJustify, ChevronDown, Undo, Redo } from 'lucide-react'

interface TextAreaCustomProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  className?: string
  minHeight?: string
}

export default function TextAreaCustom({
  value,
  onChange,
  placeholder = "Enter your message here...",
  label,
  className = "",
  minHeight = "128px"
}: TextAreaCustomProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [showListMenu, setShowListMenu] = useState(false)
  const [showAlignMenu, setShowAlignMenu] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom')
  const [dropdownCoords, setDropdownCoords] = useState({ x: 0, y: 0 })
  const [currentAlignment, setCurrentAlignment] = useState<string>('left')
  const [currentListType, setCurrentListType] = useState<string>('')
  const [isBold, setIsBold] = useState<boolean>(false)
  const [isItalic, setIsItalic] = useState<boolean>(false)
  const [isUnderline, setIsUnderline] = useState<boolean>(false)
  const [canUndo, setCanUndo] = useState<boolean>(false)
  const [canRedo, setCanRedo] = useState<boolean>(false)
  const [showLinkMenu, setShowLinkMenu] = useState<boolean>(false)
  const [currentLink, setCurrentLink] = useState<{ element: HTMLAnchorElement; url: string } | null>(null)
  const [linkMenuPosition, setLinkMenuPosition] = useState({ x: 0, y: 0 })
  const alignButtonRef = useRef<HTMLButtonElement>(null)
  const listButtonRef = useRef<HTMLButtonElement>(null)


  const execCommand = (command: string, value: string = '') => {
    editorRef.current?.focus()

    setTimeout(() => {
      // Ensure we have a selection
      const selection = window.getSelection()
      if (!selection || selection.rangeCount === 0) {
        const range = document.createRange()
        range.selectNodeContents(editorRef.current!)
        range.collapse(false)
        selection?.removeAllRanges()
        selection?.addRange(range)
      }

      document.execCommand(command, false, value)

      if (command === 'bold') {
        setIsBold(!isBold)
      } else if (command === 'italic') {
        setIsItalic(!isItalic)
      } else if (command === 'underline') {
        setIsUnderline(!isUnderline)
      }

      // Re-focus editor after command
      editorRef.current?.focus()

      // Trigger change event
      handleEditorChange()

    }, 10)
  }

  const handleUndo = () => {
    editorRef.current?.focus()
    document.execCommand('undo', false)
    handleEditorChange()
    // Update undo/redo state after a short delay
    setTimeout(() => {
      checkFormattingState()
    }, 10)
  }

  const handleRedo = () => {
    editorRef.current?.focus()
    document.execCommand('redo', false)
    handleEditorChange()
    // Update undo/redo state after a short delay
    setTimeout(() => {
      checkFormattingState()
    }, 10)
  }

  const handleEditorChange = () => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML
      const textContent = editorRef.current.textContent
      onChange(htmlContent)

      // Update list state after content change
      setTimeout(() => {
        checkFormattingState()
      }, 10)
    }
  }

  const checkFormattingState = () => {
    if (editorRef.current) {
      setIsBold(document.queryCommandState('bold'))
      setIsItalic(document.queryCommandState('italic'))
      setIsUnderline(document.queryCommandState('underline'))

      // Check undo/redo availability
      setCanUndo(document.queryCommandEnabled('undo'))
      setCanRedo(document.queryCommandEnabled('redo'))

      // Check current list state
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const listItem = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
          ? (range.commonAncestorContainer.parentElement as HTMLElement)?.closest('li')
          : (range.commonAncestorContainer as HTMLElement).closest('li')

        if (listItem) {
          const list = listItem.closest('ul, ol')
          if (list) {
            if (list.tagName === 'UL') {
              setCurrentListType('bullet')
            } else if (list.tagName === 'OL') {
              const listStyle = (list as HTMLElement).style.listStyleType
              // Also check computed styles in case inline styles are not set
              const computedStyle = window.getComputedStyle(list)
              const computedListStyle = computedStyle.listStyleType

              // Check if the list has any custom styling applied
              const hasCustomStyle = listStyle && listStyle !== 'decimal'



              if (listStyle === 'lower-alpha' || computedListStyle === 'lower-alpha') {
                setCurrentListType('alpha')
              } else if (listStyle === 'upper-alpha' || computedListStyle === 'upper-alpha') {
                setCurrentListType('upper-alpha')
              } else if (listStyle === 'lower-roman' || computedListStyle === 'lower-roman') {
                setCurrentListType('roman')
              } else if (listStyle === 'upper-roman' || computedListStyle === 'upper-roman') {
                setCurrentListType('upper-roman')
              } else if (hasCustomStyle) {
                // If there's a custom style but we can't identify it, default to number
                setCurrentListType('number')
              } else {
                setCurrentListType('number')
              }
            }
          } else {
            setCurrentListType('')
          }
        } else {
          // Check if cursor is inside a list
          const lists = editorRef.current.querySelectorAll('ul, ol')
          let isInList = false
          lists.forEach(list => {
            if (list.contains(selection.anchorNode)) {
              isInList = true
              if (list.tagName === 'UL') {
                setCurrentListType('bullet')
              } else if (list.tagName === 'OL') {
                const listStyle = (list as HTMLElement).style.listStyleType
                // Also check computed styles in case inline styles are not set
                const computedStyle = window.getComputedStyle(list)
                const computedListStyle = computedStyle.listStyleType

                // Check if the list has any custom styling applied
                const hasCustomStyle = listStyle && listStyle !== 'decimal'



                if (listStyle === 'lower-alpha' || computedListStyle === 'lower-alpha') {
                  setCurrentListType('alpha')
                } else if (listStyle === 'upper-alpha' || computedListStyle === 'upper-alpha') {
                  setCurrentListType('upper-alpha')
                } else if (listStyle === 'lower-roman' || computedListStyle === 'lower-roman') {
                  setCurrentListType('roman')
                } else if (listStyle === 'upper-roman' || computedListStyle === 'upper-roman') {
                  setCurrentListType('upper-roman')
                } else if (hasCustomStyle) {
                  // If there's a custom style but we can't identify it, default to number
                  setCurrentListType('number')
                } else {
                  setCurrentListType('number')
                }
              }
            }
          })
          if (!isInList) {
            setCurrentListType('')
          }
        }
      } else {
        setCurrentListType('')
      }
    }
  }

  const insertLink = () => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      alert('Please select text first to create a link')
      return
    }

    const selectedText = selection.toString()
    if (!selectedText) {
      alert('Please select text first to create a link')
      return
    }

    const url = prompt('Enter URL:')
    if (!url) return

    // Store the current selection range
    const range = selection.getRangeAt(0)
    
    // Create a link element
    const link = document.createElement('a')
    link.href = url
    link.textContent = selectedText
    
    // Delete the selected content and insert the link
    range.deleteContents()
    range.insertNode(link)
    
    // Clear the selection
    selection.removeAllRanges()
    
    // Trigger change event
    handleEditorChange()
    
    // Re-focus the editor
    editorRef.current?.focus()
  }

  const updateLink = (newUrl: string) => {
    if (currentLink) {
      currentLink.element.href = newUrl
      setCurrentLink({ ...currentLink, url: newUrl })
      handleEditorChange()
      setShowLinkMenu(false)
    }
  }

  const removeLink = () => {
    if (currentLink) {
      const textContent = currentLink.element.textContent
      const textNode = document.createTextNode(textContent || '')
      currentLink.element.parentNode?.replaceChild(textNode, currentLink.element)
      setShowLinkMenu(false)
      setCurrentLink(null)
      handleEditorChange()
    }
  }

  const openLink = () => {
    if (currentLink) {
      window.open(currentLink.url, '_blank', 'noopener,noreferrer')
      setShowLinkMenu(false)
    }
  }

  const insertList = (type: string) => {
    // Focus back to editor before applying command
    editorRef.current?.focus()

    // If clicking the same type, deselect it
    if (currentListType === type) {
      setCurrentListType('')
      execCommand('outdent')
      setShowListMenu(false)
      return
    }

    // First, remove any existing list formatting
    if (currentListType) {
      execCommand('outdent')
      // Small delay to ensure the outdent is processed
      setTimeout(() => {
        applyNewListType(type)
      }, 10)
    } else {
      applyNewListType(type)
    }

    setShowListMenu(false)
  }

  const applyNewListType = (type: string) => {
    // Update current list type state
    setCurrentListType(type)

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      alert('Please select text or place cursor where you want to create a list')
      return
    }

    // Restore selection if needed
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      if (!editorRef.current?.contains(range.commonAncestorContainer)) {
        // Selection is outside editor, place cursor at end
        const range = document.createRange()
        range.selectNodeContents(editorRef.current!)
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }

    // Check if selection contains existing lists and remove them first
    const range = selection.getRangeAt(0)
    const existingLists = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
      ? (range.commonAncestorContainer.parentElement as HTMLElement)?.closest('ul, ol')
      : (range.commonAncestorContainer as HTMLElement).closest('ul, ol')

    if (existingLists) {
      // If we're inside an existing list, remove it first
      execCommand('outdent')
      // Small delay to ensure the outdent is processed
      setTimeout(() => {
        applyListCommand(type)
      }, 10)
    } else {
      applyListCommand(type)
    }
  }

  const applyListCommand = (type: string) => {
    switch (type) {
      case 'bullet':
        execCommand('insertUnorderedList')
        break
      case 'number':
        execCommand('insertOrderedList')
        break
      case 'alpha':
        execCommand('insertOrderedList')
        // Apply alpha styling after a short delay
        setTimeout(() => {
          const lists = editorRef.current?.querySelectorAll('ol')
          if (lists && lists.length > 0) {
            const lastList = lists[lists.length - 1] as HTMLElement
            lastList.style.listStyleType = 'lower-alpha'
            // Force a re-render to update the state
            handleEditorChange()
          }
        }, 50)
        break
      case 'roman':
        execCommand('insertOrderedList')
        // Apply roman styling after a short delay
        setTimeout(() => {
          const lists = editorRef.current?.querySelectorAll('ol')
          if (lists && lists.length > 0) {
            const lastList = lists[lists.length - 1] as HTMLElement
            lastList.style.listStyleType = 'lower-roman'
            // Force a re-render to update the state
            handleEditorChange()
          }
        }, 50)
        break
      case 'upper-alpha':
        execCommand('insertOrderedList')
        setTimeout(() => {
          const lists = editorRef.current?.querySelectorAll('ol')
          if (lists && lists.length > 0) {
            const lastList = lists[lists.length - 1] as HTMLElement
            lastList.style.listStyleType = 'upper-alpha'
            // Force a re-render to update the state
            handleEditorChange()
          }
        }, 50)
        break
      case 'upper-roman':
        execCommand('insertOrderedList')
        setTimeout(() => {
          const lists = editorRef.current?.querySelectorAll('ol')
          if (lists && lists.length > 0) {
            const lastList = lists[lists.length - 1] as HTMLElement
            lastList.style.listStyleType = 'upper-roman'
            // Force a re-render to update the state
            handleEditorChange()
          }
        }, 50)
        break
    }
  }

  const setAlignment = (align: string) => {
    // Focus back to editor before applying command
    editorRef.current?.focus()

    // If clicking the same alignment, deselect it
    if (currentAlignment === align) {
      setCurrentAlignment('left') // Reset to default left alignment
      execCommand('justifyLeft')
      setShowAlignMenu(false)
      return
    }

    // Update current alignment state
    setCurrentAlignment(align)

    // Apply alignment
    switch (align) {
      case 'left':
        execCommand('justifyLeft')
        break
      case 'center':
        execCommand('justifyCenter')
        break
      case 'right':
        execCommand('justifyRight')
        break
      case 'justify':
        execCommand('justifyFull')
        break
    }
    setShowAlignMenu(false)
  }

  const getDropdownPosition = (buttonRef: React.RefObject<HTMLButtonElement | null>) => {
    if (!buttonRef.current) return { x: 0, y: 0, position: 'bottom' }

    const rect = buttonRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const spaceBelow = viewportHeight - rect.bottom
    const spaceAbove = rect.top

    const position = spaceBelow < 300 && spaceAbove > 300 ? 'top' : 'bottom'
    const y = position === 'bottom' ? rect.bottom + 8 : rect.top - 8

    return { x: rect.left, y, position }
  }

  const handleAlignMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!showAlignMenu) {
      const coords = getDropdownPosition(alignButtonRef)
      setDropdownCoords(coords)
      setDropdownPosition(coords.position as 'top' | 'bottom')
    }
    setShowAlignMenu(!showAlignMenu)
    setShowListMenu(false)
  }

  const handleListMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!showListMenu) {
      const coords = getDropdownPosition(listButtonRef)
      setDropdownCoords(coords)
      setDropdownPosition(coords.position as 'top' | 'bottom')
    }
    setShowListMenu(!showListMenu)
    setShowAlignMenu(false)
  }

  // Handle link clicks to show edit menu
  const handleLinkClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'A') {
      e.preventDefault()
      e.stopPropagation()
      
      const url = target.getAttribute('href')
      if (url) {
        // Show link edit menu
        const rect = target.getBoundingClientRect()
        setLinkMenuPosition({
          x: rect.left,
          y: rect.bottom + 8
        })
        setCurrentLink({ element: target as HTMLAnchorElement, url })
        setShowLinkMenu(true)
      }
    }
  }

  // Add tooltip for links and handle hover
  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'A') {
        const url = target.getAttribute('href')
        if (url) {
          target.title = `Click to edit or Ctrl+Click to open: ${url}`
          // Add hover effect
          target.style.cursor = 'pointer'
          target.style.textDecoration = 'underline'
          target.style.color = '#2563eb'
        }
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'A') {
        // Remove hover effect
        target.style.cursor = 'default'
        target.style.textDecoration = 'underline'
        target.style.color = '#2563eb'
      }
    }

    const handleCtrlClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'A' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        const url = target.getAttribute('href')
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer')
        }
      }
    }

    editor.addEventListener('mouseover', handleMouseOver)
    editor.addEventListener('mouseout', handleMouseOut)
    editor.addEventListener('click', handleCtrlClick)

    return () => {
      editor.removeEventListener('mouseover', handleMouseOver)
      editor.removeEventListener('mouseout', handleMouseOut)
      editor.removeEventListener('click', handleCtrlClick)
    }
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement

      // Don't close if clicking inside dropdown
      if (target.closest('[data-dropdown="true"]')) {
        return
      }

      // Don't close if clicking on toolbar buttons
      if (target.closest('.toolbar-container')) {
        return
      }

      // Don't close if clicking on link menu
      if (target.closest('[data-link-menu="true"]')) {
        return
      }

      setShowListMenu(false)
      setShowAlignMenu(false)
      setShowLinkMenu(false)
    }

    // Check dropdown position based on viewport
    const checkDropdownPosition = () => {
      const toolbar = document.querySelector('.toolbar-container')
      if (toolbar) {
        const rect = toolbar.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        const spaceBelow = viewportHeight - rect.bottom
        const spaceAbove = rect.top

        if (spaceBelow < 300 && spaceAbove > 300) {
          setDropdownPosition('top')
        } else {
          setDropdownPosition('bottom')
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', checkDropdownPosition)
    window.addEventListener('resize', checkDropdownPosition)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', checkDropdownPosition)
      window.removeEventListener('resize', checkDropdownPosition)
    }
  }, [])

  // Prevent dropdown from closing when clicking inside
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  // Update editor content when value prop changes
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  // Add event listeners for formatting state tracking
  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    const handleSelectionChange = () => {
      checkFormattingState()
    }

    const handleMouseUp = () => {
      checkFormattingState()
    }

    const handleKeyUp = () => {
      checkFormattingState()
    }

    const handleClick = () => {
      checkFormattingState()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      checkFormattingState()

      // Handle keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            if (!e.shiftKey) {
              e.preventDefault()
              handleUndo()
            }
            break
          case 'y':
            e.preventDefault()
            handleRedo()
            break
          case 'shift':
            if (e.key === 'Z') {
              e.preventDefault()
              handleRedo()
            }
            break
        }
      }
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    editor.addEventListener('mouseup', handleMouseUp)
    editor.addEventListener('keyup', handleKeyUp)
    editor.addEventListener('click', handleClick)
    editor.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
      editor.removeEventListener('mouseup', handleMouseUp)
      editor.removeEventListener('keyup', handleKeyUp)
      editor.removeEventListener('click', handleClick)
      editor.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Add styles for links when editor is focused
  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    const handleFocus = () => {
      // Add custom styles for links
      const style = document.createElement('style')
      style.id = 'editor-link-styles'
      style.textContent = `
        [contenteditable] a {
          color: #2563eb !important;
          text-decoration: underline !important;
          background-color: rgba(37, 99, 235, 0.1) !important;
          padding: 1px 2px !important;
          border-radius: 2px !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }
        [contenteditable] a:hover {
          background-color: rgba(37, 99, 235, 0.2) !important;
          color: #1d4ed8 !important;
          text-decoration: underline !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2) !important;
        }
        [contenteditable] a:active {
          transform: translateY(0) !important;
          box-shadow: 0 1px 2px rgba(37, 99, 235, 0.2) !important;
        }
      `
      document.head.appendChild(style)
    }

    const handleBlur = () => {
      // Remove custom styles when editor loses focus
      const style = document.getElementById('editor-link-styles')
      if (style) {
        style.remove()
      }
    }

    editor.addEventListener('focus', handleFocus)
    editor.addEventListener('blur', handleBlur)

    return () => {
      editor.removeEventListener('focus', handleFocus)
      editor.removeEventListener('blur', handleBlur)
      const style = document.getElementById('editor-link-styles')
      if (style) {
        style.remove()
      }
    }
  }, [])

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="border rounded-md overflow-hidden relative">
        {/* Toolbar */}
        <div className="toolbar-container flex items-center gap-1 p-2 bg-gray-50 border-b relative">
          {/* Undo/Redo */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={!canUndo}
            className={`p-2 rounded transition-colors duration-150 ${canUndo
              ? 'cursor-pointer hover:bg-gray-200'
              : 'cursor-not-allowed opacity-50'
              }`}
            title={canUndo ? "Undo (Ctrl+Z)" : "Nothing to undo"}
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={!canRedo}
            className={`p-2 rounded transition-colors duration-150 ${canRedo
              ? 'cursor-pointer hover:bg-gray-200'
              : 'cursor-not-allowed opacity-50'
              }`}
            title={canRedo ? "Redo (Ctrl+Y)" : "Nothing to redo"}
          >
            <Redo className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          <button
            type="button"
            onClick={() => execCommand('bold')}
            className={`p-2 rounded cursor-pointer transition-colors duration-150 ${isBold
              ? 'bg-[#F1C27D]/60 text-black'
              : 'hover:bg-gray-200'
              }`}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('italic')}
            className={`p-2 rounded cursor-pointer transition-colors duration-150 ${isItalic
              ? 'bg-[#F1C27D]/60 text-black'
              : 'hover:bg-gray-200'
              }`}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('underline')}
            className={`p-2 rounded cursor-pointer transition-colors duration-150 ${isUnderline
              ? 'bg-[#F1C27D]/60 text-black '
              : 'hover:bg-gray-200'
              }`}
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          <button
            type="button"
            onClick={insertLink}
            className="p-2 cursor-pointer hover:bg-gray-200 rounded"
            title="Create Link (Select text first)"
          >
            <Link className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Alignment Dropdown */}
          <div className="relative">
            <button
              ref={alignButtonRef}
              type="button"
              onClick={handleAlignMenuToggle}
              className="p-2 cursor-pointer hover:bg-gray-200 rounded flex items-center gap-1"
              title="Text Alignment"
            >
              {currentAlignment === 'left' && <AlignLeft className="h-4 w-4" />}
              {currentAlignment === 'center' && <AlignCenter className="h-4 w-4" />}
              {currentAlignment === 'right' && <AlignRight className="h-4 w-4" />}
              {currentAlignment === 'justify' && <AlignJustify className="h-4 w-4" />}
              {!currentAlignment && <AlignLeft className="h-4 w-4" />}
              <ChevronDown className="h-3 w-3" />
            </button>

          </div>

          {/* List Dropdown */}
          <div className="relative">
            <button
              ref={listButtonRef}
              type="button"
              onClick={handleListMenuToggle}
              className={`p-2 cursor-pointer rounded flex items-center gap-1 transition-colors duration-150 ${currentListType
                ? 'bg-[#F1C27D]/60 text-black'
                : 'hover:bg-gray-200'
                }`}
              title="List Options"
            >
              <List className="h-4 w-4" />
              <ChevronDown className="h-3 w-3" />
            </button>

          </div>
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleEditorChange}
          onClick={handleLinkClick}
          className="min-h-32 p-3 focus:outline-none relative z-10"
          style={{ minHeight }}
          data-placeholder={placeholder}
        />
      </div>

      {/* Portal for dropdowns */}
      {typeof window !== 'undefined' && (
        <>
          {showAlignMenu && createPortal(
            <div
              data-dropdown="true"
              className="fixed bg-white  border border-gray-200 rounded-lg shadow-xl z-[9999] min-w-48 backdrop-blur-sm"
              style={{
                left: dropdownCoords.x,
                top: dropdownPosition === 'bottom' ? dropdownCoords.y : 'auto',
                bottom: dropdownPosition === 'top' ? window.innerHeight - dropdownCoords.y : 'auto'
              }}
              onClick={handleDropdownClick}
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                <h3 className="text-sm font-semibold text-gray-700">Text Alignment</h3>
              </div>

              {/* Alignment Options */}
              <div className="p-2">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setAlignment('left')
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-md transition-colors duration-150 group mb-1 cursor-pointer ${currentAlignment === 'left'
                    ? 'bg-[#F1C27D]/20 border border-[#F1C27D]/20'
                    : 'hover:bg-[#F1C27D]/20'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${currentAlignment === 'left' ? 'bg-[#F1C27D]' : 'bg-gray-100'
                      }`}>
                      <AlignLeft className={`h-3 w-3 ${currentAlignment === 'left' ? 'text-white' : 'text-gray-600'
                        }`} />
                    </div>
                    <span className={`text-sm font-medium ${currentAlignment === 'left' ? 'text-gray-800' : 'text-gray-700'
                      }`}>Left Align</span>
                  </div>
                  <span className={`text-xs ${currentAlignment === 'left' ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`}>
                    {currentAlignment === 'left' ? 'Active' : 'Default'}
                  </span>
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setAlignment('center')
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-md transition-colors duration-150 group mb-1 cursor-pointer ${currentAlignment === 'center'
                    ? 'bg-[#F1C27D]/20 border border-[#F1C27D]/20'
                    : 'hover:bg-[#F1C27D]/20'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${currentAlignment === 'center' ? 'bg-[#F1C27D]' : 'bg-gray-100'
                      }`}>
                      <AlignCenter className={`h-3 w-3 ${currentAlignment === 'center' ? 'text-white' : 'text-gray-600'
                        }`} />
                    </div>
                    <span className={`text-sm font-medium ${currentAlignment === 'center' ? 'text-gray-800' : 'text-gray-700'
                      }`}>Center Align</span>
                  </div>
                  <span className={`text-xs ${currentAlignment === 'center' ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`}>
                    {currentAlignment === 'center' ? 'Active' : 'Centered'}
                  </span>
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setAlignment('right')
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-md transition-colors duration-150 group mb-1 cursor-pointer ${currentAlignment === 'right'
                    ? 'bg-[#F1C27D]/20 border border-[#F1C27D]/20'
                    : 'hover:bg-[#F1C27D]/20'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${currentAlignment === 'right' ? 'bg-[#F1C27D]' : 'bg-gray-100'
                      }`}>
                      <AlignRight className={`h-3 w-3 ${currentAlignment === 'right' ? 'text-white' : 'text-gray-600'
                        }`} />
                    </div>
                    <span className={`text-sm font-medium ${currentAlignment === 'right' ? 'text-gray-800' : 'text-gray-700'
                      }`}>Right Align</span>
                  </div>
                  <span className={`text-xs ${currentAlignment === 'right' ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`}>
                    {currentAlignment === 'right' ? 'Active' : 'Right'}
                  </span>
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setAlignment('justify')
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-md transition-colors duration-150 group cursor-pointer ${currentAlignment === 'justify'
                    ? 'bg-[#F1C27D]/20 border border-[#F1C27D]/20'
                    : 'hover:bg-[#F1C27D]/20'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${currentAlignment === 'justify' ? 'bg-[#F1C27D]' : 'bg-gray-100'
                      }`}>
                      <AlignJustify className={`h-3 w-3 ${currentAlignment === 'justify' ? 'text-white' : 'text-gray-600'
                        }`} />
                    </div>
                    <span className={`text-sm font-medium ${currentAlignment === 'justify' ? 'text-gray-800' : 'text-gray-700'
                      }`}>Justify</span>
                  </div>
                  <span className={`text-xs ${currentAlignment === 'justify' ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`}>
                    {currentAlignment === 'justify' ? 'Active' : 'Full width'}
                  </span>
                </button>
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 rounded-b-lg">
                <p className="text-xs text-gray-500 text-center">
                  Select text to align
                </p>
              </div>
            </div>,
            document.body
          )}

          {showListMenu && createPortal(
            <div
              data-dropdown="true"
              className="fixed bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] min-w-56 backdrop-blur-sm"
              style={{
                left: dropdownCoords.x,
                top: dropdownPosition === 'bottom' ? dropdownCoords.y : 'auto',
                bottom: dropdownPosition === 'top' ? window.innerHeight - dropdownCoords.y : 'auto'
              }}
              onClick={handleDropdownClick}
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                <h3 className="text-sm font-semibold text-gray-700">List Options</h3>
              </div>

              {/* Unordered Lists Section */}
              <div className="p-2">

                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    insertList('bullet')
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-md transition-colors duration-150 group ${currentListType === 'bullet'
                    ? 'bg-[#F1C27D]/20  bg-opacity-20 border border-[#F1C27D]/20 cursor-pointer'
                    : 'hover:bg-[#F1C27D]/20 cursor-pointer hover:bg-opacity-10'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${currentListType === 'bullet' ? 'bg-[#F1C27D]/20 cursor-pointer' : 'bg-gray-100'
                      }`}>
                      <span className={`text-sm ${currentListType === 'bullet' ? 'text-white' : 'text-gray-600'
                        }`}>•</span>
                    </div>
                    <span className={`text-sm font-medium ${currentListType === 'bullet' ? 'text-gray-800' : 'text-gray-700'
                      }`}>Bullet List</span>
                  </div>
                  <span className={`text-xs ${currentListType === 'bullet' ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`}>
                    {currentListType === 'bullet' ? 'Active' : '• • •'}
                  </span>
                </button>
              </div>

              {/* Ordered Lists Section */}
              <div className="p-2 border-t border-gray-100">

                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    insertList('number')
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`flex items-center cursor-pointer justify-between w-full px-3 py-2.5 rounded-md transition-colors duration-150 group mb-1 ${currentListType === 'number'
                    ? 'bg-[#F1C27D]/20 bg-opacity-20 border border-[#F1C27D]/20 cursor-pointer'
                    : 'hover:bg-[#F1C27D]/20 cursor-pointer hover:bg-opacity-10'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${currentListType === 'number' ? 'bg-[#F1C27D]/20 cursor-pointer' : 'bg-gray-100'
                      }`}>
                      <span className={`text-xs font-semibold ${currentListType === 'number' ? 'text-white' : 'text-gray-600'
                        }`}>1</span>
                    </div>
                    <span className={`text-sm font-medium ${currentListType === 'number' ? 'text-gray-800' : 'text-gray-700'
                      }`}>Numbers</span>
                  </div>
                  <span className={`text-xs ${currentListType === 'number' ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`}>
                    {currentListType === 'number' ? 'Active' : '1, 2, 3'}
                  </span>
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    insertList('alpha')
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-md transition-colors duration-150 group mb-1 ${currentListType === 'alpha'
                    ? 'bg-[#F1C27D]/20 bg-opacity-20 border border-[#F1C27D]/20 cursor-pointer'
                    : 'hover:bg-[#F1C27D]/20 cursor-pointer hover:bg-opacity-10'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${currentListType === 'alpha' ? 'bg-[#F1C27D]/20 cursor-pointer' : 'bg-gray-100'
                      }`}>
                      <span className={`text-xs font-semibold ${currentListType === 'alpha' ? 'text-white' : 'text-gray-600'
                        }`}>a</span>
                    </div>
                    <span className={`text-sm font-medium ${currentListType === 'alpha' ? 'text-gray-800' : 'text-gray-700'
                      }`}>Lower Alpha</span>
                  </div>
                  <span className={`text-xs ${currentListType === 'alpha' ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`}>
                    {currentListType === 'alpha' ? 'Active' : 'a, b, c'}
                  </span>
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    insertList('upper-alpha')
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-md transition-colors duration-150 group mb-1 ${currentListType === 'upper-alpha'
                    ? 'bg-[#F1C27D]/20  bg-opacity-20 border border-[#F1C27D]/20 cursor-pointer'
                    : 'hover:bg-[#F1C27D]/20 cursor-pointer hover:bg-opacity-10'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${currentListType === 'upper-alpha' ? 'bg-[#F1C27D]/20 cursor-pointer' : 'bg-gray-100'
                      }`}>
                      <span className={`text-xs font-semibold ${currentListType === 'upper-alpha' ? 'text-white' : 'text-gray-600'
                        }`}>A</span>
                    </div>
                    <span className={`text-sm font-medium ${currentListType === 'upper-alpha' ? 'text-gray-800' : 'text-gray-700'
                      }`}>Upper Alpha</span>
                  </div>
                  <span className={`text-xs ${currentListType === 'upper-alpha' ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`}>
                    {currentListType === 'upper-alpha' ? 'Active' : 'A, B, C'}
                  </span>
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    insertList('roman')
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-md transition-colors duration-150 group mb-1 ${currentListType === 'roman'
                    ? 'bg-[#F1C27D]/20  bg-opacity-20 border border-[#F1C27D]/20 cursor-pointer'
                    : 'hover:bg-[#F1C27D]/20 cursor-pointer hover:bg-opacity-10'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${currentListType === 'roman' ? 'bg-[#F1C27D]/20 cursor-pointer' : 'bg-gray-100'
                      }`}>
                      <span className={`text-xs font-semibold ${currentListType === 'roman' ? 'text-white' : 'text-gray-600'
                        }`}>i</span>
                    </div>
                    <span className={`text-sm font-medium ${currentListType === 'roman' ? 'text-gray-800' : 'text-gray-700'
                      }`}>Lower Roman</span>
                  </div>
                  <span className={`text-xs ${currentListType === 'roman' ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`}>
                    {currentListType === 'roman' ? 'Active' : 'i, ii, iii'}
                  </span>
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    insertList('upper-roman')
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-md transition-colors duration-150 group ${currentListType === 'upper-roman'
                    ? 'bg-[#F1C27D]/20  bg-opacity-20 border border-[#F1C27D]/20 cursor-pointer'
                    : 'hover:bg-[#F1C27D]/20 cursor-pointer hover:bg-opacity-10'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${currentListType === 'upper-roman' ? 'bg-[#F1C27D]/20 cursor-pointer' : 'bg-gray-100'
                      }`}>
                      <span className={`text-xs font-semibold ${currentListType === 'upper-roman' ? 'text-white' : 'text-gray-600'
                        }`}>I</span>
                    </div>
                    <span className={`text-sm font-medium ${currentListType === 'upper-roman' ? 'text-gray-800' : 'text-gray-700'
                      }`}>Upper Roman</span>
                  </div>
                  <span className={`text-xs ${currentListType === 'upper-roman' ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`}>
                    {currentListType === 'upper-roman' ? 'Active' : 'I, II, III'}
                  </span>
                </button>
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 rounded-b-lg">
                <p className="text-xs text-gray-500 text-center">
                  Select text or place cursor to create list
                </p>
              </div>
            </div>,
            document.body
          )}

          {/* Link Edit Menu */}
          {showLinkMenu && currentLink && createPortal(
            <div
              data-link-menu="true"
              className="fixed bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] min-w-80 backdrop-blur-sm"
              style={{
                left: linkMenuPosition.x,
                top: linkMenuPosition.y
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                <h3 className="text-sm font-semibold text-gray-700">Edit Link</h3>
              </div>

              {/* Link URL Input */}
              <div className="p-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      URL
                    </label>
                    <input
                      type="url"
                      defaultValue={currentLink.url}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F1C27D] focus:border-transparent"
                      placeholder="https://example.com"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          updateLink(e.currentTarget.value)
                        }
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        const input = document.querySelector('[data-link-menu="true"] input') as HTMLInputElement
                        if (input) {
                          updateLink(input.value)
                        }
                      }}
                      className="px-4 py-2 bg-[#F1C27D] text-white rounded-md text-sm font-medium hover:bg-[#F1C27D]/90 transition-colors"
                    >
                      Update Link
                    </button>
                    <button
                      onClick={openLink}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Open Link
                    </button>
                    <button
                      onClick={removeLink}
                      className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      Remove Link
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 rounded-b-lg">
                <p className="text-xs text-gray-500 text-center">
                  Press Enter to update or use Ctrl+Click to open link directly
                </p>
              </div>
            </div>,
            document.body
          )}
        </>
      )}
    </div>
  )
}
