import { Router, Request, Response } from "express";
import { WordModel } from '../models/word.model'
import { wordQuery } from "../controllers/wordSearch";
const router = Router()


router.get('/', wordQuery)

router.get('/all', async (req: Request, res: Response) => {
  WordModel.find({})
    // .populate('synonyms', 'word')
    .populate('language')
    .exec((err, words) => {
      if(err) return res.json({ message: err.message })
      return res.json({ words })
    })
})

router.get('/:word', async (req: Request, res: Response) => {
  const { word } = req.params 
  WordModel
    .findOne({ word })
    .populate('synonyms', 'word')
    .exec((err, word) => {
      if(err) return res.json({ message: err.message })
      return res.json({ word })
    })
})

router.get('/:word/synonyms', async (req: Request, res: Response) => {
  const { word } = req.params 
  WordModel
    .findOne({ word })
    .populate('synonyms', 'word')
    .exec((err, word) => {
      if(err) return res.json({ message: err.message })

      return res.json({ synonyms: word?.synonyms })
    })
})

export { router }