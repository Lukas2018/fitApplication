import psycopg2
import pandas as pd

product_sql = """INSERT INTO app_product(name, manufacturer, nutrient_id)
             VALUES(%s, %s, %s);"""
nutrient_sql = """INSERT INTO app_nutrientes(kcal, protein, carbohydrates, fats, portion)
             VALUES(%s, %s, %s, %s, %s) RETURNING id;"""
df = pd.read_csv('product_db.csv')
try:
    conn = psycopg2.connect(user='postgres', password='postgres', host='127.0.0.1', port='5433', database='fit')
    cur = conn.cursor()
    for index, row in df.iterrows():
        cur.execute(nutrient_sql, (row['Kcal'], row['Protein'], row['Carbohydrates'], row['Fats'], 100))
        nutrient_id = cur.fetchone()[0]
        cur.execute(product_sql, (row['Name'], row['Manufacturer'], nutrient_id))
        print(nutrient_id)
    conn.commit()
    cur.close()
except (Exception, psycopg2.DatabaseError) as error:
    print(error)
finally:
    if conn is not None:
        conn.close()