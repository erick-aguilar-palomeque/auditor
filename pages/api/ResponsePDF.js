import fs from 'fs'
import path from 'path'

export default (req, res) => {
    const filePath = path.resolve('.', './public/files/output.pdf')
    const buffer = fs.readFileSync(filePath)
    res.setHeader('Content-Type', 'application/pdf')
    res.send(buffer)
}