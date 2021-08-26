import logging

logging.getLogger().setLevel(logging.INFO)


def hello(event, context):
    logging.info(f'Event = {event}')

    return {
        'statusCode': 200,
        'body': 'Hello from lambda',
        'Headers': {
            'content-type': 'text/plain'
        }
    }
