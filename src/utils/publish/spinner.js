function Spin(placeholder) {
    if (!(this instanceof Spin)) return new Spin(placeholder)
    this.pos = 0
    this.placeholder = placeholder || ''
}

Spin.prototype = {
    counstructor: Spin,
    start: function () {
        this.spinner = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
        this.loop = setInterval(
            function () {
                let msg = '\r\x1B[34m' + this.spinner[this.pos] + ' \x1B[0m' + this.placeholder + '\u001B[?25l'
                let columns = typeof process.stderr.columns === 'number' ? process.stderr.columns : 100
                msg = msg.slice(0, columns)
                process.stdout.write(msg)
                this.pos = ++this.pos % this.spinner.length
            }.bind(this),
            100
        )
        return this
    },
    stop: function (message) {
        process.stdout.clearLine()
        process.stdout.write(`\r${message}\u001B[?25h`)
        clearInterval(this.loop)
        return this
    },
    update: function (placeholder) {
        process.stdout.clearLine()
        this.placeholder = placeholder + ' '
        return this
    }
}

module.exports = Spin
