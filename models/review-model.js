const pool = require("../database/")

/* ***************************
 *  Get all reviews by vehicle
 * ************************** */

async function getReviewsByVehicle(inv_id) {
  try {
    const sql = `
      SELECT 
        r.review_id,
        r.review_text,
        r.review_rating,
        r.review_date,
        ac.account_firstname,
        ac.account_lastname
      FROM public.review AS r
      JOIN public.account AS ac
        ON r.account_id = ac.account_id
      WHERE r.inv_id = $1
      ORDER BY r.review_date DESC
    `

    const data = await pool.query(sql, [inv_id])
    return data.rows
  } catch (error) {
    console.error("getReviewsByVehicle error:", error)
    throw error
  }
}

/* ***************************
 *  Get stats by review
 * ************************** */
async function getReviewStats(inv_id){
    try {
        const sql = 
            `SELECT AVG(review_rating) AS average_rating, COUNT(*) AS review_count
            FROM public.review
            WHERE inv_id = $1`
        
        const data = await pool.query(sql, [inv_id])
        return data.rows[0]
    } catch (error) {
        console.error("getReviewStats error:", error)
        throw error
    }
}

async function getReviewByAccountAndVehicle(inv_id, account_id){
    try {
        const sql = 
            `SELECT * FROM review
            WHERE inv_id = $1 AND account_id = $2`
        
        const data = await pool.query(sql, [inv_id, account_id])
        return data.rows[0]
    } catch (error) {
        console.error("getReviewByAccountAndVehicle error:", error)
        throw error
    }
}

async function insertReview (review_text, review_rating, inv_id, account_id) {
  try {
    const sql = `
      INSERT INTO review (review_text, review_rating, inv_id, account_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `
    const data = await pool.query(sql, [review_text, review_rating, inv_id, account_id])
    return data.rows[0]
  } catch (error) {
    console.error("insertReview: " + error)
    throw error
  }
}


module.exports = {getReviewsByVehicle, getReviewStats, getReviewByAccountAndVehicle, insertReview}