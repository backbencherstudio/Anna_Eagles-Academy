import React, { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Bold, Italic, Underline, Link, List, AlignLeft, AlignCenter, AlignRight, AlignJustify, ChevronDown, Undo, Redo, Type, ListChecks, Highlighter } from 'lucide-react'

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
  placeholder = "",
  label,
  className = "",
  minHeight = "188px"
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
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false)
  const [showColorPalette, setShowColorPalette] = useState<boolean>(false)
  const [currentHighlightColor, setCurrentHighlightColor] = useState<string>('#FEF3C7')
  const [canUndo, setCanUndo] = useState<boolean>(false)
  const [canRedo, setCanRedo] = useState<boolean>(false)
  const [showLinkMenu, setShowLinkMenu] = useState<boolean>(false)
  const [showLinkModal, setShowLinkModal] = useState<boolean>(false)
  const [currentLink, setCurrentLink] = useState<{ element: HTMLAnchorElement; url: string } | null>(null)
  const [linkMenuPosition, setLinkMenuPosition] = useState({ x: 0, y: 0 })
  const [linkFormData, setLinkFormData] = useState({ url: '', text: '', openInNewTab: true })
  const alignButtonRef = useRef<HTMLButtonElement>(null)
  const listButtonRef = useRef<HTMLButtonElement>(null)
  const highlightButtonRef = useRef<HTMLButtonElement>(null)
  const linkRangeRef = useRef<Range | null>(null)


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
      } else if (command === 'backColor') {
        setIsHighlighted(!isHighlighted)
      }

      // Re-focus editor after command
      editorRef.current?.focus()

      // Trigger change event
      handleEditorChange()

    }, 10)
  }

  const toggleHighlight = () => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      alert('Please select text first to highlight')
      return
    }

    const selectedText = selection.toString()
    if (!selectedText) {
      alert('Please select text first to highlight')
      return
    }

    editorRef.current?.focus()
    
    // Toggle highlight
    if (isHighlighted) {
      // Remove highlight by setting background to transparent
      document.execCommand('backColor', false, 'transparent')
    } else {
      // Add highlight with current color
      document.execCommand('backColor', false, currentHighlightColor)
    }
    
    setIsHighlighted(!isHighlighted)
    handleEditorChange()
  }

  const handleHighlightMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!showColorPalette) {
      const coords = getDropdownPosition(highlightButtonRef)
      setDropdownCoords(coords)
      setDropdownPosition(coords.position as 'top' | 'bottom')
    }
    setShowColorPalette(!showColorPalette)
    setShowListMenu(false)
    setShowAlignMenu(false)
  }

  const applyHighlightColor = (color: string) => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      alert('Please select text first to highlight')
      return
    }

    const selectedText = selection.toString()
    if (!selectedText) {
      alert('Please select text first to highlight')
      return
    }

    editorRef.current?.focus()
    
    if (color === 'transparent') {
      // Remove highlight
      document.execCommand('backColor', false, 'transparent')
      setIsHighlighted(false)
    } else {
      // Apply highlight color
      document.execCommand('backColor', false, color)
      setCurrentHighlightColor(color)
      setIsHighlighted(true)
    }
    
    setShowColorPalette(false)
    handleEditorChange()
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

  const resetFormattingStates = () => {
    // Reset all formatting states when clicking outside or losing focus
    const selection = window.getSelection()
    
    if (!selection || selection.rangeCount === 0) {
      // No selection, reset all states
      setIsBold(false)
      setIsItalic(false)
      setIsUnderline(false)
      setIsHighlighted(false)
      setCurrentAlignment('left')
      setCurrentListType('')
      return
    }

    const selectedText = selection.toString()
    if (!selectedText) {
      // No text selected, reset all states
      setIsBold(false)
      setIsItalic(false)
      setIsUnderline(false)
      setIsHighlighted(false)
      setCurrentAlignment('left')
      setCurrentListType('')
      return
    }

    // Check if selection is within the editor
    const range = selection.getRangeAt(0)
    if (!editorRef.current?.contains(range.commonAncestorContainer)) {
      // Selection is outside editor, reset all states
      setIsBold(false)
      setIsItalic(false)
      setIsUnderline(false)
      setIsHighlighted(false)
      setCurrentAlignment('left')
      setCurrentListType('')
      return
    }

    // If we have a valid selection within editor, check actual formatting
    checkFormattingState()
  }

  const checkFormattingState = () => {
    if (editorRef.current) {
      const selection = window.getSelection()
      
      // Only check formatting if we have a valid selection within the editor
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        
        // Check if selection is within the editor
        if (editorRef.current.contains(range.commonAncestorContainer)) {
          setIsBold(document.queryCommandState('bold'))
          setIsItalic(document.queryCommandState('italic'))
          setIsUnderline(document.queryCommandState('underline'))
          
          // Check if current selection has background color (highlight)
          const container = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
            ? range.commonAncestorContainer.parentElement
            : range.commonAncestorContainer as HTMLElement
          
          if (container) {
            const backgroundColor = window.getComputedStyle(container).backgroundColor
            const isHighlightedColor = backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                                     backgroundColor !== 'transparent' && 
                                     backgroundColor !== 'rgb(255, 255, 255)' &&
                                     backgroundColor !== 'rgba(255, 255, 255, 1)'
            setIsHighlighted(isHighlightedColor)
          } else {
            setIsHighlighted(false)
          }
        } else {
          // Selection is outside editor, reset states
          setIsBold(false)
          setIsItalic(false)
          setIsUnderline(false)
          setIsHighlighted(false)
        }
      } else {
        // No selection, reset states
        setIsBold(false)
        setIsItalic(false)
        setIsUnderline(false)
        setIsHighlighted(false)
      }

      // Check undo/redo availability
      setCanUndo(document.queryCommandEnabled('undo'))
      setCanRedo(document.queryCommandEnabled('redo'))

      // Check current list state
      const currentSelection = window.getSelection()
      if (currentSelection && currentSelection.rangeCount > 0) {
        const range = currentSelection.getRangeAt(0)
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
            if (currentSelection && list.contains(currentSelection.anchorNode)) {
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

    // Store the current selection range for later use
    const range = selection.getRangeAt(0)

    // Set form data with selected text
    setLinkFormData({
      url: '',
      text: selectedText,
      openInNewTab: true
    })

    // Show the smart modal
    setShowLinkModal(true)

    // Store the range in a ref for later use
    linkRangeRef.current = range
  }

  const handleCreateLink = () => {
    if (!linkFormData.url.trim()) {
      alert('Please enter a URL')
      return
    }

    // Get the stored range
    const range = linkRangeRef.current
    if (!range) return

    // Create a link element
    const link = document.createElement('a')
    link.href = linkFormData.url
    link.textContent = linkFormData.text || linkFormData.url
    link.target = linkFormData.openInNewTab ? '_blank' : '_self'
    link.rel = linkFormData.openInNewTab ? 'noopener noreferrer' : ''

    // Delete the selected content and insert the link
    range.deleteContents()
    range.insertNode(link)

    // Clear the selection
    const selection = window.getSelection()
    selection?.removeAllRanges()

    // Reset form and close modal
    setLinkFormData({ url: '', text: '', openInNewTab: true })
    setShowLinkModal(false)

    // Trigger change event
    handleEditorChange()

    // Re-focus the editor
    editorRef.current?.focus()

    // Clean up
    linkRangeRef.current = null
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

      // Don't close if clicking inside the editor
      if (target.closest('[contenteditable="true"]')) {
        return
      }

      setShowListMenu(false)
      setShowAlignMenu(false)
      setShowColorPalette(false)
      setShowLinkMenu(false)

      // Reset formatting states when clicking outside editor
      setTimeout(() => {
        resetFormattingStates()
      }, 10)
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

      // Reset formatting states when editor loses focus
      setTimeout(() => {
        resetFormattingStates()
      }, 100)
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
        {/* Toolbar - Mobile Responsive with Horizontal Scroll */}
        <div className="toolbar-container bg-gray-50 border-b relative">
          <div className="flex items-center gap-1 p-2 overflow-x-auto scrollbar-hide min-w-0 sm:gap-2">
            {/* Undo/Redo Group */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={handleUndo}
                disabled={!canUndo}
                className={`p-2 sm:p-2.5 rounded transition-colors duration-150 ${canUndo
                  ? 'cursor-pointer hover:bg-gray-200'
                  : 'cursor-not-allowed opacity-50'
                  }`}
                title={canUndo ? "Undo (Ctrl+Z)" : "Nothing to undo"}
              >
                <Undo className="h-4 w-4 " />
              </button>
              <button
                type="button"
                onClick={handleRedo}
                disabled={!canRedo}
                className={`p-2 sm:p-2.5 rounded transition-colors duration-150 ${canRedo
                  ? 'cursor-pointer hover:bg-gray-200'
                  : 'cursor-not-allowed opacity-50'
                  }`}
                title={canRedo ? "Redo (Ctrl+Y)" : "Nothing to redo"}
              >
                <Redo className="h-4 w-4 " />
              </button>
            </div>

            <div className="w-px h-6 bg-gray-300 mx-1 flex-shrink-0"></div>

            {/* Text Formatting Group */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => execCommand('bold')}
                className={`p-2 sm:p-2.5 rounded cursor-pointer transition-colors duration-150 ${isBold
                  ? 'bg-[#F1C27D]/60 text-black'
                  : 'hover:bg-gray-200'
                  }`}
                title="Bold"
              >
                <Bold className="h-4 w-4 " />
              </button>
              <button
                type="button"
                onClick={() => execCommand('italic')}
                className={`p-2 sm:p-2.5 rounded cursor-pointer transition-colors duration-150 ${isItalic
                  ? 'bg-[#F1C27D]/60 text-black'
                  : 'hover:bg-gray-200'
                  }`}
                title="Italic"
              >
                <Italic className="h-4 w-4 " />
              </button>
                            <button
                type="button"
                onClick={() => execCommand('underline')}
                className={`p-2 sm:p-2.5 rounded cursor-pointer transition-colors duration-150 ${isUnderline
                  ? 'bg-[#F1C27D]/60 text-black '
                  : 'hover:bg-gray-200'
                  }`}
                title="Underline"
              >
                <Underline className="h-4 w-4 " />
              </button>
              <button
                ref={highlightButtonRef}
                type="button"
                onClick={handleHighlightMenuToggle}
                className={`p-2 sm:p-2.5 rounded cursor-pointer transition-colors duration-150 ${isHighlighted
                  ? 'bg-[#F1C27D]/60 text-black'
                  : 'hover:bg-gray-200'
                  }`}
                title="Highlight Text (Select text first)"
              >
                <Highlighter className="h-4 w-4 " />
              </button>
            </div>
            
            <div className="w-px h-6 bg-gray-300 mx-1 flex-shrink-0"></div>

            {/* Link Group */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={insertLink}
                className="p-2 sm:p-2.5 cursor-pointer hover:bg-gray-200 rounded"
                title="Create Link (Select text first)"
              >
                <Link className="h-4 w-4 " />
              </button>
            </div>

            <div className="w-px h-6 bg-gray-300 mx-1 flex-shrink-0"></div>

            {/* Alignment Dropdown */}
            <div className="relative flex-shrink-0">
              <button
                ref={alignButtonRef}
                type="button"
                onClick={handleAlignMenuToggle}
                className="p-2 sm:p-2.5 cursor-pointer hover:bg-gray-200 rounded flex items-center gap-1"
                title="Text Alignment"
              >
                {currentAlignment === 'left' && <AlignLeft className="h-4 w-4 " />}
                {currentAlignment === 'center' && <AlignCenter className="h-4 w-4 " />}
                {currentAlignment === 'right' && <AlignRight className="h-4 w-4 " />}
                {currentAlignment === 'justify' && <AlignJustify className="h-4 w-4 " />}
                {!currentAlignment && <AlignLeft className="h-4 w-4 " />}
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>

            {/* List Dropdown */}
            <div className="relative flex-shrink-0">
              <button
                ref={listButtonRef}
                type="button"
                onClick={handleListMenuToggle}
                className={`p-2 sm:p-2.5 cursor-pointer rounded flex items-center gap-1 transition-colors duration-150 ${currentListType
                  ? 'bg-[#F1C27D]/60 text-black'
                  : 'hover:bg-gray-200'
                  }`}
                title="List Options"
              >
                <List className="h-4 w-4 " />
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
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
              className="fixed bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] min-w-48 backdrop-blur-sm"
              style={{
                left: dropdownCoords.x,
                top: dropdownPosition === 'bottom' ? dropdownCoords.y : 'auto',
                bottom: dropdownPosition === 'top' ? window.innerHeight - dropdownCoords.y : 'auto'
              }}
              onClick={handleDropdownClick}
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4 text-gray-600" />
                  <h3 className="text-sm font-semibold text-gray-700">Text Alignment</h3>
                </div>
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
                <div className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-gray-600" />
                  <h3 className="text-sm font-semibold text-gray-700">List Options</h3>
                </div>
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

          {/* Color Palette Dropdown */}
          {showColorPalette && createPortal(
            <div
              data-dropdown="true"
              className="fixed bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] min-w-48 backdrop-blur-sm"
              style={{
                left: dropdownCoords.x,
                top: dropdownPosition === 'bottom' ? dropdownCoords.y : 'auto',
                bottom: dropdownPosition === 'top' ? window.innerHeight - dropdownCoords.y : 'auto'
              }}
              onClick={handleDropdownClick}
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                <div className="flex items-center gap-2">
                  <Highlighter className="h-4 w-4 text-gray-600" />
                  <h3 className="text-sm font-semibold text-gray-700">Highlight Colors</h3>
                </div>
              </div>

              {/* Color Options */}
              <div className="p-4">
                <div className="grid grid-cols-6 gap-2">
                  {/* Light Green */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      applyHighlightColor('#D1FAE5')
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    className="w-8 h-8 rounded-full bg-[#D1FAE5] border-2 border-gray-200 hover:border-gray-400 transition-colors cursor-pointer"
                    title="Light Green"
                  />
                  
                  {/* Light Blue */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      applyHighlightColor('#DBEAFE')
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    className="w-8 h-8 rounded-full bg-[#DBEAFE] border-2 border-gray-200 hover:border-gray-400 transition-colors cursor-pointer"
                    title="Light Blue"
                  />
                  
                  {/* Reddish Brown */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      applyHighlightColor('#FEE2E2')
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    className="w-8 h-8 rounded-full bg-[#FEE2E2] border-2 border-gray-200 hover:border-gray-400 transition-colors cursor-pointer"
                    title="Light Red"
                  />
                  
                  {/* Purple */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      applyHighlightColor('#F3E8FF')
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    className="w-8 h-8 rounded-full bg-[#F3E8FF] border-2 border-gray-200 hover:border-gray-400 transition-colors cursor-pointer"
                    title="Light Purple"
                  />
                  
                  {/* Olive Green */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      applyHighlightColor('#FEF3C7')
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    className="w-8 h-8 rounded-full bg-[#FEF3C7] border-2 border-gray-200 hover:border-gray-400 transition-colors cursor-pointer"
                    title="Light Yellow"
                  />
                  
                  {/* Clear/No Color */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      applyHighlightColor('transparent')
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 hover:border-gray-500 transition-colors cursor-pointer relative"
                    title="Clear Highlight"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-0.5 bg-gray-400 rotate-45"></div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 rounded-b-lg">
                <p className="text-xs text-gray-500 text-center">
                  Select text and choose a color to highlight
                </p>
              </div>
            </div>,
            document.body
          )}

          {/* Link Edit Menu */}
          {showLinkMenu && currentLink && createPortal(
            <div
              data-link-menu="true"
              className="fixed z-[9999] w-fit bg-white border border-gray-400 rounded-lg "
              style={{
                left: linkMenuPosition.x,
                top: linkMenuPosition.y,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
              }}
              onClick={(e) => e.stopPropagation()}
            >

              <div className="flex items-center">
                <input
                  type="url"
                  defaultValue={currentLink.url}
                  className="flex-1 px-5 py-3 bg-transparent text-black placeholder-gray-400 text-sm focus:outline-none border-none"
                  placeholder="Paste a link..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      updateLink(e.currentTarget.value)
                    }
                  }}
                />

                {/* Action Icons */}
                <div className="flex items-center gap-1">
                  {/* Undo/Return Button */}
                  <button
                    onClick={() => {
                      const input = document.querySelector('[data-link-menu="true"] input[type="url"]') as HTMLInputElement
                      if (input) {
                        updateLink(input.value)
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
                    title="Update Link"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>

                  {/* Open Link Button */}
                  <button
                    onClick={openLink}
                    className="p-1.5 text-gray-400 cursor-pointer hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
                    title="Open Link"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>

                  {/* Remove Link Button */}
                  <button
                    onClick={removeLink}
                    className="p-1.5 text-gray-400 cursor-pointer hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
                    title="Remove Link"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}

          {/* Smart Link Creation Modal */}
          {showLinkModal && createPortal(
            <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-[9999] p-4">
              <div
                className="bg-white rounded-xl shadow-2xl max-w-md w-full backdrop-blur-sm border border-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Create Link</h3>
                    <button
                      onClick={() => {
                        setShowLinkModal(false)
                        setLinkFormData({ url: '', text: '', openInNewTab: true })
                        linkRangeRef.current = null
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Form */}
                <div className="p-6 space-y-4">
                  {/* Link Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link Text
                    </label>
                    <input
                      type="text"
                      value={linkFormData.text}
                      onChange={(e) => setLinkFormData({ ...linkFormData, text: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F1C27D] focus:border-transparent transition-all"
                      placeholder="Enter link text..."
                    />
                  </div>

                  {/* URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={linkFormData.url}
                      onChange={(e) => setLinkFormData({ ...linkFormData, url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F1C27D] focus:border-transparent transition-all"
                      placeholder="https://example.com"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex items-center justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowLinkModal(false)
                      setLinkFormData({ url: '', text: '', openInNewTab: true })
                      linkRangeRef.current = null
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateLink}
                    disabled={!linkFormData.url.trim()}
                    className="px-6 py-2 bg-[#F1C27D] text-white rounded-lg text-sm font-medium hover:bg-[#F1C27D]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Create Link
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}
        </>
      )}

      {/* Custom CSS for scrollbar hiding */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
