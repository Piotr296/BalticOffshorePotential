# -*- coding: utf-8 -*-
"""
Created on Mon Nov  4 15:04:58 2019

@author: Petronium
"""

import pandas as pd

fp = 'data.csv'

df = pd.read_csv(fp)
df_new = pd.DataFrame(df.groupby('Unit of data: ID').mean())

df_new.to_excel('new_data.xlsx')