SELECT ai.openai_chat_complete(
    'gpt-4o-mini', 
    jsonb_build_array( 
        jsonb_build_object('role', 'system', 'content', 'you are a helpful assistant'),
        jsonb_build_object('role', 'system', 'content', 'You are a robot assistant that helps you get a new job'),
        jsonb_build_object('role', 'system', 'content', 'If there is a similar job, you can recommend it'),
        jsonb_build_object('role', 'system', 'content', 'We will analyze and answer only from our database'),
        jsonb_build_object('role', 'system', 'content', (SELECT STRING_AGG(
    jsonb_build_object(
        'Title', Title,
        'Description', Description,
        'Department', Department,
        'Requirements', Requirements,
        'Status', status
    )::TEXT, ', '
) AS concatenated_rows
FROM JobPostings
)),
        jsonb_build_object('role', 'user', 'content', 'Танайд Frontend Developer  ажлын зар байна уу хэрэв байвал нарийвчилсан мэдээлэл өгөөч')
    )
)->'choices'->0->'message'->>'content';



