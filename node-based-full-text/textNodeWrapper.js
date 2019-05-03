class TextNodeWrapper {
    constructor (node) {
        if (!(node instanceof window.Text)) {
            throw new Error('TextNodeWrapper must be given a text node as argument')
        }
        this.node = node
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

    hasFocus () {
        return hasFocus(this.getNode())
    }
}