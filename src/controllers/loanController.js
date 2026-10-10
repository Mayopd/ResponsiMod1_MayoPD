const supabase = require('../config/supabase');

/**
 * GET /loans
 * Get all loans with optional filters
 * Query params: status, member_id, book_id
 */
const getAllLoans = async (req, res, next) => {
  try {
    const { status, member_id, book_id } = req.query;

    let query = supabase
      .from('loans')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }
    if (member_id) {
      query = query.eq('member_id', member_id);
    }
    if (book_id) {
      query = query.eq('book_id', book_id);
    }

    const { data, error } = await query;

    if (error) throw { statusCode: 400, message: error.message };

    res.status(200).json({
      success: true,
      total: data.length,
      data,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /loans/:id
 * Get a single loan by ID
 */
const getLoanById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('loans')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: { message: `Loan with id ${id} not found` },
        });
      }
      throw { statusCode: 400, message: error.message };
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /loans
 * Create a new loan record
 * Body: { member_id, member_name, book_id, book_title, loan_date, due_date }
 */
const createLoan = async (req, res, next) => {
  try {
    const { member_id, member_name, book_id, book_title, loan_date, due_date } = req.body;

    // Validate required fields
    if (!member_id || !member_name || !book_id || !book_title || !loan_date || !due_date) {
      return res.status(400).json({
        success: false,
        error: {
          message:
            'All fields are required: member_id, member_name, book_id, book_title, loan_date, due_date',
        },
      });
    }

    const newLoan = {
      member_id,
      member_name,
      book_id,
      book_title,
      loan_date,
      due_date,
      status: 'Dipinjam',
      return_date: null,
    };

    const { data, error } = await supabase.from('loans').insert([newLoan]).select().single();

    if (error) throw { statusCode: 400, message: error.message };

    res.status(201).json({
      success: true,
      message: 'Loan created successfully',
      data,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /loans/:id
 * Update an existing loan record (e.g., return book, extend due date)
 * Body: any updatable fields
 */
const updateLoan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Disallow updating certain fields
    delete updates.id;
    delete updates.created_at;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'No fields provided for update' },
      });
    }

    // Auto-compute status based on return_date and due_date
    if (updates.return_date) {
      const returnDate = new Date(updates.return_date);
      const dueDate = new Date(updates.due_date || req.body.due_date);

      if (!isNaN(returnDate) && !isNaN(dueDate)) {
        updates.status = returnDate > dueDate ? 'Terlambat' : 'Dikembalikan';
      } else {
        updates.status = 'Dikembalikan';
      }
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('loans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: { message: `Loan with id ${id} not found` },
        });
      }
      throw { statusCode: 400, message: error.message };
    }

    res.status(200).json({
      success: true,
      message: 'Loan updated successfully',
      data,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /loans/:id
 * Delete a loan record
 */
const deleteLoan = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if exists first
    const { data: existing, error: findError } = await supabase
      .from('loans')
      .select('id')
      .eq('id', id)
      .single();

    if (findError || !existing) {
      return res.status(404).json({
        success: false,
        error: { message: `Loan with id ${id} not found` },
      });
    }

    const { error } = await supabase.from('loans').delete().eq('id', id);

    if (error) throw { statusCode: 400, message: error.message };

    res.status(200).json({
      success: true,
      message: `Loan with id ${id} deleted successfully`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan,
};
