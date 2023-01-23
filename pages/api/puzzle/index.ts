import dbConnect from 'libs/db/mongoose';
import Puzzle from 'models/Puzzle';
import { SortOrder } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  item?: any;
  message: string;
  error?: any;
  page?: number;
  isLast?: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { method } = req;
  await dbConnect();
  if (method === 'POST') {
    try {
      const puzzle = new Puzzle(req.body.data);
      puzzle.save((err: any, doc: any) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: 'failed', error: err });
        }
        res.status(201).json({ item: doc, message: 'success' });
      });
    } catch (err) {
      res.status(500).json({ message: 'failed', error: err });
    }
  }
  if (method === 'GET') {
    const { page = 1, limit = 8, sortField, sortType, searchField, searchKeyword, showPerfect = 'false' } = req.query;
    const sortTypeList = ['asc', 'desc'];
    const sortFieldList = ['createdAt', 'perfection'];

    try {
      if (
        Array.isArray(sortField) || // 정렬필드는 array이면 안된다.
        Array.isArray(searchField) || // 검색필드는 array이면 안된다.
        Array.isArray(searchKeyword) || // 검색값은 array이면 안된다.
        Array.isArray(sortType) || // 정렬타입은 array이면 안된다.
        !Number.isInteger(Number(limit)) || // limit는 정수
        !Number.isInteger(Number(page)) // page는 정수
      ) {
        return res.status(500).json({ message: 'Parameter Error' });
      }
      const pageN = Number(page);
      const limitN = Number(limit);
      const sortObject: { [key: string]: SortOrder } = {};
      if (sortType && sortField) {
        const sortFields = sortField.split(',');
        const sortTypes = sortType.split(',');
        if (sortFields.length !== sortTypes.length) {
          return res.status(500).json({ message: 'Parameter Error' });
        }
        for (let i = 0; i < sortFields.length; i++) {
          if (!sortFields[i] || !sortTypes[i]) continue;
          if (!sortTypeList.includes(sortTypes[i]) || !sortFieldList.includes(sortFields[i])) {
            return res.status(500).json({ message: 'Parameter Error' });
          }
          sortObject[sortField] = sortType === 'asc' ? 'asc' : 'desc';
        }
        if (!sortFields.includes('createdAt')) {
          sortObject['createdAt'] = 'desc';
        }
      } else {
        sortObject['createdAt'] = 'desc';
      }

      const searchObject: { [key: string]: any } = {};
      if (searchField && searchKeyword) {
        const searchFieldList = searchField.split(',');
        const searchKeywordList = searchKeyword.split(',');
        if (searchFieldList.length !== searchKeywordList.length) {
          return res.status(500).json({ message: 'Parameter Error' });
        }
        for (let i = 0; i < searchFieldList.length; i++) {
          if (!searchFieldList[i] || !searchKeywordList[i]) continue;
          searchObject[searchFieldList[i]] = searchKeywordList[i];
        }
      }

      const query = Puzzle.find(searchObject);
      const countQuery = Puzzle.find(searchObject);
      if (showPerfect === 'false') {
        query.where('perfection').ne(1);
        countQuery.where('perfection').ne(1);
      }
      const puzzle = await query
        .sort(sortObject)
        .skip((pageN - 1) * limitN)
        .limit(limitN)
        .exec();
      const totalCount = await countQuery.count().exec();
      const totalPage = Math.ceil(totalCount / limitN);
      const isLast = totalPage === pageN || totalCount === 0;
      return res.status(201).json({ item: puzzle, message: 'success', page: pageN, isLast });
    } catch (err) {
      res.status(500).json({ error: 'server error', message: 'failed' });
    }
  }
}
