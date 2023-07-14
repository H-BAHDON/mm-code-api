// const fs = require('fs');
// const pool = require('../db/testExerciseDb');

// // Read the JSON file
// // Read the JSON file
// // Read the JSON file
// // Read the JSON file
// fs.readFile('../../../mm-code/src/Exercise/testExercise.json', 'utf8', async (err, data) => {
//   if (err) {
//     console.error('Error reading JSON file:', err);
//     return;
//   }

//   try {
//     const exercises = JSON.parse(data);
//     const tableName = 'test_data'; // Replace with your actual table name

//     for (const exercise of exercises) {
//       const client = await pool.connect(); // Acquire a connection from the pool

//       try {
//         const values = [
//           exercise.id,
//           exercise.lang,
//           exercise.code,
//           exercise.score,
//           exercise.explanation,
//         ];

//         const importQuery = `
//           INSERT INTO ${tableName} (id, lang, code, score, explanation)
//           VALUES ($1, $2, $3, $4, $5)
//           ON CONFLICT (id) DO UPDATE SET
//             lang = EXCLUDED.lang,
//             code = EXCLUDED.code,
//             score = EXCLUDED.score,
//             explanation = EXCLUDED.explanation
//         `;

//         await client.query('BEGIN'); // Begin a transaction
//         await client.query(importQuery, values); // Execute the import query
//         await client.query('COMMIT'); // Commit the transaction
//         console.log('Exercise imported:', exercise.id);
//       } catch (error) {
//         await client.query('ROLLBACK'); // Rollback the transaction in case of error
//         console.error('Error importing exercise:', error);
//       } finally {
//         client.release(); // Release the connection back to the pool
//       }
//     }

//     console.log('JSON data imported into the database.');
//   } catch (error) {
//     console.error('Error parsing JSON data:', error);
//   }
// });


