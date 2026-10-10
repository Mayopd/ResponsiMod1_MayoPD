const express = require('express');
const router = express.Router();
const {
  getAllLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan,
} = require('../controllers/loanController');

/**
 * @route   GET /api/loans
 * @desc    Get all loans (supports ?status=, ?member_id=, ?book_id= filters)
 */
router.get('/', getAllLoans);

/**
 * @route   GET /api/loans/:id
 * @desc    Get single loan by ID
 */
router.get('/:id', getLoanById);

/**
 * @route   POST /api/loans
 * @desc    Create a new loan
 */
router.post('/', createLoan);

/**
 * @route   PUT /api/loans/:id
 * @desc    Update a loan (e.g., return book)
 */
router.put('/:id', updateLoan);

/**
 * @route   DELETE /api/loans/:id
 * @desc    Delete a loan record
 */
router.delete('/:id', deleteLoan);

module.exports = router;
