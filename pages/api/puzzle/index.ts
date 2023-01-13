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
    const {
      page = 1,
      limit = 8,
      sortField = 'createdAt',
      sortType = 'desc',
      searchField = 'secretRoom',
      searchKeyword = 'false',
    } = req.query;
    const sortTypeList = ['asc', 'desc'];
    const sortFieldList = ['createdAt', 'perfection'];
    try {
      if (
        Array.isArray(sortField) || // 정렬필드는 array이면 안된다.
        Array.isArray(searchField) || // 검색필드는 array이면 안된다.
        Array.isArray(searchKeyword) || // 검색값은 array이면 안된다.
        Array.isArray(sortType) || // 정렬타입은 array이면 안된다.
        !sortTypeList.includes(sortType) || // 정렬타입은 오름차순 또는 내림차순
        !sortFieldList.includes(sortField) || // 정렬필드는 createdAt, perfection
        !Number.isInteger(Number(limit)) || // limit는 정수
        !Number.isInteger(Number(page)) // page는 정수
      ) {
        return res.status(500).json({ message: 'Parameter Error' });
      }
      const pageN = Number(page);
      const limitN = Number(limit);
      const sortObject: { [key: string]: SortOrder } = {};
      sortObject[sortField] = sortType === 'asc' ? 'asc' : 'desc';
      const searchObject: { [key: string]: any } = {};
      if (searchField) {
        searchObject[searchField] = searchKeyword;
      }
      const puzzle = await Puzzle.find(searchObject)
        .where('perfection')
        .ne(1)
        .sort(sortObject)
        .skip((pageN - 1) * limitN)
        .limit(limitN);
      const totalCount = await Puzzle.count(searchObject).where('perfection').ne(1);
      const totalPage = Math.ceil(totalCount / limitN);
      const isLast = totalPage === pageN || totalCount === 0;
      return res.status(201).json({ item: puzzle, message: 'success', page: pageN, isLast });
    } catch (err) {
      res.status(500).json({ error: 'server error', message: 'failed' });
    }
  }
}
