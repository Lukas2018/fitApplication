import math

def convert_seconds_to_time_string(seconds):
    hours = math.floor(seconds/3600)
    minutes = math.floor((seconds % 3600) / 60)
    seconds = seconds - hours * 3600 - minutes * 60
    result = add_zero_if_needed(hours) + ':' + add_zero_if_needed(minutes) + ':' + add_zero_if_needed(seconds)
    return result

def add_zero_if_needed(time):
    if time < 10:
        return '0' + str(time)
    return str(time)