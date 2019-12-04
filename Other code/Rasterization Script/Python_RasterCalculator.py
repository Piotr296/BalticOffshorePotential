# -*- coding: utf-8 -*-
"""
Created on Mon Nov 11 13:35:09 2019

@author: Petronium
"""

# Import system modules
import rasterio
from rasterio.plot import show

fp1 = r'Bathymetry_Clip.tif'
fp2 = r'Shipping_Clip.tif'
fp3 = r'WindMap_Clip.tif'

bathymetry = rasterio.open(fp1)
shipping = rasterio.open(fp2)
windspeed = rasterio.open(fp3)

bathymetry_b = bathymetry.read(1)
shipping_b = shipping.read(1)
windspeed_b = windspeed.read(1)

def raster_calculation(raster_list, weight_list):
    
    """
    Function to calcule weighted sum of the rasters
    
    Args:
        raster_list (list): input rasters
        weight_list (list): input weight of the rasters
    Returns:
        result raster
    
    """
    
    assert len(raster_list) == len(weight_list), "Both list should have the same length!"
    
    result_map = 0
    
    for r, w in zip(raster_list, weight_list):
        result_map += r * w
        
    return result_map


def saving_to_file(ras_name):
    
    """
    Function to save the raster
    
    Args:
        name(variable): name of the raster 
    Returns:
        None
    
    """
    
    with rasterio.Env():

        # Write an array as a raster band to a new 8-bit file. For
        # the new file's profile, we start with the profile of the source
        profile = bathymetry.profile
    
        # And then change the band count to 1, set the
        # dtype to uint8, and specify LZW compression.
        profile.update(
            dtype=rasterio.float32,
            count=1,
            compress='lzw')
        
        with rasterio.open('ResultMap.tif', 'w', **profile) as dst:
            dst.write(ras_name.astype(rasterio.float32), 1)


result_map = raster_calculation((bathymetry_b, shipping_b, windspeed_b), (0.35,0.2,0.45))
saving_to_file(result_map)

