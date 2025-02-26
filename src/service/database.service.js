const { getRedisData, setRedisWithExpiry } = require("./redis.service");
const { getClient } = require('../pg')

async function getActorsByTitle(title) {
    // eslint-disable-next-line no-use-before-define
    const redisData = await getRedisData(title);
    if (redisData && redisData.title) {
      return [redisData];
    }
    const client = await getClient();
    try {
      const text = `SELECT title,ARRAY_AGG (first_name || ' ' || last_name) actors 
                    FROM film    
                    INNER JOIN film_actor USING (film_id)
                    INNER JOIN actor USING (actor_id)
                    where title = $1
                    GROUP BY title`;
      const { rows: filmRecords } = await client.query(text, [title]);
      // eslint-disable-next-line no-use-before-define
      await setRedisWithExpiry(title, filmRecords[0]);
      return filmRecords;
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
}

module.exports = {
  getActorsByTitle
}