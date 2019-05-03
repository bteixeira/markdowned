class TextNodeWrapper {
    constructor (node) {
        if (!(node instanceof window.Text)) {
            throw new Error('TextNodeWrapper must be given a text node as argument')
        }
        this.node = node
        this._focusOffset = null
    }

    getNode () {
        return this.node
    }

    getText () {
        return this.getNode().textContent
    }

    /**
     * Splits this node into 3 nodes, given the required separators or indices.
     *
     * If either of the separators is given as a number, that separator will be the index at which to do the split.
     * If provided as a string, regex, or other, then the text content will be searched for that content using indexOf().
     * If either the separators are invalid or not present in the text (including negative indices) then null will be
     * returned.
     *
     * Will return an array with the three nodes in order (this node followed by the two new ones).
     *
     * The split is done including the separators in the middle node.
     * @param separator1
     * @param separator2
     */
    splitThree (separator1, separator2) {
        if (typeof separator1 !== 'number') {
            separator1 = this.getText().indexOf(separator1)
        }
        if (separator1 < 0 || separator1 >= this.getText().length) {
            return null
        }
        if (typeof separator2 !== 'number') {
            separator2 = this.getText().indexOf(separator2, separator1 + 1)
        }
        if (separator2 < 0 || separator2 >= this.getText().length) {
            return null
        }

        // TODO UNFINISHED
    }

    merge (other) {
        if (!(other instanceof TextNodeWrapper)) {
            throw new Error('Can only merge with other TextNodeWrapper\'s')
        }

        let newFocusIndex = null
        if (this.hasFocus()) {
            newFocusIndex = window.getSelection().focusOffset
        } else if (other.hasFocus()) {
            newFocusIndex = window.getSelection().focusOffset + this.getText().length
        }
        this.getNode().nodeValue += other.getText()
        other.getNode().remove()
        if (newFocusIndex !== null) {
            window.getSelection().collapse(this.getNode(), newFocusIndex)
        }
        return this
    }

    static build (text) {
        const textNode = document.createTextNode(text)
        return new TextNodeWrapper(textNode)
    }

    /**
     * @param index
     * @param keep whether to keep the separator on this node (true) or on the generated node (false, default)
     * @returns {*}
     */
    splitRight (index, keep) {
        if (typeof index !== 'number') {
            index = this.getText().indexOf(index)
        }
        if (keep) {
            index += 1
        }
        if (index < 0 || index >= this.getText().length) {
            return null
        }
        const splitText = this.getText().slice(index)
        const other = TextNodeWrapper.build(splitText)
        if (this.hasFocus()) {
            if (window.getSelection().focusOffset <= index) {
                this.memorizeFocus()
            } else {
                other._focusOffset = window.getSelection().focusOffset - index
            }
        } else if (this._focusOffset && this._focusOffset > index) {
            other._focusOffset = this._focusOffset - index
            this._focusOffset = null
        }
        this.getNode().textContent = this.getText().slice(0, index)
        this.applyFocus()
        return other
    }

    memorizeFocus () {
        this._focusOffset = window.getSelection().focusOffset
    }

    applyFocus () {
        if (this._focusOffset !== null) {
            window.getSelection().collapse(this.getNode(), this._focusOffset)
        }
    }

    promote () {
        const $backticks = $(`<span class="backticks"/>`)
        $backticks.append(this.getNode())
        return $backticks
    }

    hasFocus () {
        // TODO THIS SHOULD PROBABLY ALSO RETURN TRUE IF A FOCUS OFFSET IS MEMORIZED
        // TODO OR AT LEAST CHECK THAT THE FOCUSED NODE IS THE RIGHT ONE
        return hasFocus(this.getNode())
    }
}