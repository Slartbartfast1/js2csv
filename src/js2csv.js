export default {
    data: [],
    name: Date.now() + '.csv',
    heads: {},
    csvData: '',
    parsed: false,
    transformer (row) {
        return row
    },
    setData (data) {
        this.data = data || this.data
        return this
    },
    setHead (heads) {
        this.heads = heads || this.heads
        return this
    },
    setName (name) {
        if (name) {
            let reg = new RegExp(/.csv$/)
            this.name = reg.test(name) ? name : name + '.csv'
        }
        return this
    },
    transform (transformer) {
        if (typeof transformer === 'function') {
            this.transformer = transformer
        }
        return this
    },
    parse () {
        let csv = ''
        let keys = Object.keys(this.heads).length ? Object.keys(this.heads) : Object.keys(this.data[0])
        if (Object.keys(this.heads).length) {
            csv = '"' + Object.values(this.heads).join('","') + '"\r\n'
        }
        csv = this.data.reduce((pre, cur) => {
            cur = this.transformer(cur)
            return pre + '"' + keys.map(key => {
                return cur[key] || ''
            }).join('","') + '"\r\n'
        }, csv)
        this.csvData = csv
        this.parsed = true
        return this
    },
    render () {
        if (!this.parsed) {
            this.parse()
        }
        return this.csvData
    },
    download () {
        if (!this.parsed) {
            this.parse()
        }
        if (window.Blob && window.URL && window.URL.createObjectURL) {
            let link = document.createElement('a')
            let blob = new Blob(['\uFEFF' + this.csvData], {type: 'text/csv'})
            link.download = this.name
            link.href = URL.createObjectURL(blob)
            link.click()
            URL.revokeObjectURL(blob)
        }
    }
}
