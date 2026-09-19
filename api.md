# ProductFeedback

Types:

- <code><a href="./src/resources/product-feedback.ts">ProductFeedbackCreateResponse</a></code>
- <code><a href="./src/resources/product-feedback.ts">ProductFeedbackRetrieveResponse</a></code>

Methods:

- <code title="post /api/v1/platform/product-feedbacks">client.productFeedback.<a href="./src/resources/product-feedback.ts">create</a>({ ...params }) -> ProductFeedbackCreateResponse</code>
- <code title="get /api/v1/platform/product-feedbacks/{id}">client.productFeedback.<a href="./src/resources/product-feedback.ts">retrieve</a>(id) -> ProductFeedbackRetrieveResponse</code>

# Fleet

## Threads

Types:

- <code><a href="./src/resources/fleet/threads.ts">ThreadActivateSandboxResponse</a></code>

Methods:

- <code title="post /v1/fleet/threads/{thread_id}/sandbox-activation">client.fleet.threads.<a href="./src/resources/fleet/threads.ts">activateSandbox</a>(threadID) -> ThreadActivateSandboxResponse</code>

# Datasets

Types:

- <code><a href="./src/resources/datasets/datasets.ts">DataType</a></code>
- <code><a href="./src/resources/datasets/datasets.ts">Dataset</a></code>
- <code><a href="./src/resources/datasets/datasets.ts">DatasetTransformation</a></code>
- <code><a href="./src/resources/datasets/datasets.ts">DatasetVersion</a></code>
- <code><a href="./src/resources/datasets/datasets.ts">FeedbackCreateCoreSchema</a></code>
- <code><a href="./src/resources/datasets/datasets.ts">Missing</a></code>
- <code><a href="./src/resources/datasets/datasets.ts">SortByDatasetColumn</a></code>

## ExperimentRuns

Types:

- <code><a href="./src/resources/datasets/experiment-runs.ts">ExperimentRunQueryResponse</a></code>

Methods:

- <code title="post /api/v2/datasets/{dataset_id}/experiment-runs">client.datasets.experimentRuns.<a href="./src/resources/datasets/experiment-runs.ts">query</a>(datasetID, { ...params }) -> ExperimentRunQueryResponsesItemsCursorPostPagination</code>

# Runs

Types:

- <code><a href="./src/resources/runs/runs.ts">ResponseBodyForRunsGenerateQuery</a></code>
- <code><a href="./src/resources/runs/runs.ts">Run</a></code>
- <code><a href="./src/resources/runs/runs.ts">RunIngest</a></code>
- <code><a href="./src/resources/runs/runs.ts">RunSchema</a></code>
- <code><a href="./src/resources/runs/runs.ts">RunSelectField</a></code>
- <code><a href="./src/resources/runs/runs.ts">RunStatsQueryParams</a></code>
- <code><a href="./src/resources/runs/runs.ts">RunType</a></code>
- <code><a href="./src/resources/runs/runs.ts">RunTypeEnum</a></code>
- <code><a href="./src/resources/runs/runs.ts">RunsFilterDataSourceTypeEnum</a></code>
- <code><a href="./src/resources/runs/runs.ts">RunGetURLResponse</a></code>

Methods:

- <code title="get /api/v2/runs/{run_id}/url">client.runs.<a href="./src/resources/runs/runs.ts">getURL</a>(runID, { ...params }) -> RunGetURLResponse</code>
- <code title="post /api/v2/runs/query">client.runs.<a href="./src/resources/runs/runs.ts">queryV2</a>({ ...params }) -> RunsItemsCursorPostPagination</code>
- <code title="get /api/v2/runs/{run_id}">client.runs.<a href="./src/resources/runs/runs.ts">retrieveV2</a>(runID, { ...params }) -> Run</code>

## Share

Types:

- <code><a href="./src/resources/runs/share.ts">ShareCreateResponse</a></code>

Methods:

- <code title="post /api/v2/runs/{run_id}/share">client.runs.share.<a href="./src/resources/runs/share.ts">create</a>(runID, { ...params }) -> ShareCreateResponse</code>
- <code title="delete /api/v2/runs/{trace_id}/share">client.runs.share.<a href="./src/resources/runs/share.ts">delete</a>(traceID, { ...params }) -> void</code>

# Threads

Types:

- <code><a href="./src/resources/threads/threads.ts">Thread</a></code>
- <code><a href="./src/resources/threads/threads.ts">ThreadStats</a></code>
- <code><a href="./src/resources/threads/threads.ts">ThreadTrace</a></code>
- <code><a href="./src/resources/threads/threads.ts">ThreadAggregateStatsResponse</a></code>

Methods:

- <code title="post /api/v2/threads/stats">client.threads.<a href="./src/resources/threads/threads.ts">aggregateStats</a>({ ...params }) -> ThreadAggregateStatsResponse</code>
- <code title="get /api/v2/threads/{thread_id}/traces">client.threads.<a href="./src/resources/threads/threads.ts">listTraces</a>(threadID, { ...params }) -> ThreadTracesItemsCursorGetPagination</code>
- <code title="post /api/v2/threads/query">client.threads.<a href="./src/resources/threads/threads.ts">query</a>({ ...params }) -> ThreadsItemsCursorPostPagination</code>
- <code title="get /api/v2/threads/{thread_id}/stats">client.threads.<a href="./src/resources/threads/threads.ts">stats</a>(threadID, { ...params }) -> ThreadStats</code>

## Share

Types:

- <code><a href="./src/resources/threads/share.ts">ShareCreateResponse</a></code>
- <code><a href="./src/resources/threads/share.ts">ShareRetrieveResponse</a></code>

Methods:

- <code title="post /api/v2/threads/{thread_id}/share">client.threads.share.<a href="./src/resources/threads/share.ts">create</a>(threadID, { ...params }) -> ShareCreateResponse</code>
- <code title="get /api/v2/threads/{thread_id}/share">client.threads.share.<a href="./src/resources/threads/share.ts">retrieve</a>(threadID, { ...params }) -> ShareRetrieveResponse</code>
- <code title="delete /api/v2/threads/{thread_id}/share">client.threads.share.<a href="./src/resources/threads/share.ts">delete</a>(threadID, { ...params }) -> void</code>

# Traces

Types:

- <code><a href="./src/resources/traces.ts">Trace</a></code>
- <code><a href="./src/resources/traces.ts">TraceAggregates</a></code>
- <code><a href="./src/resources/traces.ts">TraceListRunsResponse</a></code>

Methods:

- <code title="get /api/v2/traces/{trace_id}/runs">client.traces.<a href="./src/resources/traces.ts">listRuns</a>(traceID, { ...params }) -> TraceListRunsResponse</code>
- <code title="post /api/v2/traces/query">client.traces.<a href="./src/resources/traces.ts">query</a>({ ...params }) -> TracesItemsCursorPostPagination</code>

# OnlineEvaluators

Types:

- <code><a href="./src/resources/online-evaluators.ts">BulkDeleteEvaluatorFailedItem</a></code>
- <code><a href="./src/resources/online-evaluators.ts">BulkDeleteEvaluatorsResponse</a></code>
- <code><a href="./src/resources/online-evaluators.ts">CreateOnlineCodeEvaluatorRequest</a></code>
- <code><a href="./src/resources/online-evaluators.ts">CreateOnlineEvaluatorRequest</a></code>
- <code><a href="./src/resources/online-evaluators.ts">CreateOnlineEvaluatorResponse</a></code>
- <code><a href="./src/resources/online-evaluators.ts">CreateOnlineLlmEvaluatorRequest</a></code>
- <code><a href="./src/resources/online-evaluators.ts">GetOnlineEvaluatorSpendResponse</a></code>
- <code><a href="./src/resources/online-evaluators.ts">OnlineCodeEvaluator</a></code>
- <code><a href="./src/resources/online-evaluators.ts">OnlineEvaluator</a></code>
- <code><a href="./src/resources/online-evaluators.ts">OnlineEvaluatorRunRule</a></code>
- <code><a href="./src/resources/online-evaluators.ts">OnlineEvaluatorSpendDay</a></code>
- <code><a href="./src/resources/online-evaluators.ts">OnlineEvaluatorSpendGroup</a></code>
- <code><a href="./src/resources/online-evaluators.ts">OnlineEvaluatorType</a></code>
- <code><a href="./src/resources/online-evaluators.ts">OnlineLlmEvaluator</a></code>
- <code><a href="./src/resources/online-evaluators.ts">OnlineSpendLimit</a></code>
- <code><a href="./src/resources/online-evaluators.ts">UpdateOnlineCodeEvaluatorRequest</a></code>
- <code><a href="./src/resources/online-evaluators.ts">UpdateOnlineEvaluatorRequest</a></code>
- <code><a href="./src/resources/online-evaluators.ts">UpdateOnlineEvaluatorResponse</a></code>
- <code><a href="./src/resources/online-evaluators.ts">UpdateOnlineLlmEvaluatorRequest</a></code>

Methods:

- <code title="post /api/v1/platform/evaluators">client.onlineEvaluators.<a href="./src/resources/online-evaluators.ts">create</a>({ ...params }) -> CreateOnlineEvaluatorResponse</code>
- <code title="get /api/v1/platform/evaluators/{evaluator_id}">client.onlineEvaluators.<a href="./src/resources/online-evaluators.ts">retrieve</a>(evaluatorID) -> OnlineEvaluator</code>
- <code title="patch /api/v1/platform/evaluators/{evaluator_id}">client.onlineEvaluators.<a href="./src/resources/online-evaluators.ts">update</a>(evaluatorID, { ...params }) -> UpdateOnlineEvaluatorResponse</code>
- <code title="get /api/v1/platform/evaluators">client.onlineEvaluators.<a href="./src/resources/online-evaluators.ts">list</a>({ ...params }) -> OnlineEvaluatorsOffsetPaginationOnlineEvaluators</code>
- <code title="delete /api/v1/platform/evaluators/{evaluator_id}">client.onlineEvaluators.<a href="./src/resources/online-evaluators.ts">delete</a>(evaluatorID, { ...params }) -> void</code>
- <code title="delete /api/v1/platform/evaluators">client.onlineEvaluators.<a href="./src/resources/online-evaluators.ts">bulkDelete</a>({ ...params }) -> BulkDeleteEvaluatorsResponse</code>
- <code title="get /api/v1/platform/evaluators/spend">client.onlineEvaluators.<a href="./src/resources/online-evaluators.ts">spend</a>({ ...params }) -> GetOnlineEvaluatorSpendResponse</code>

# Public

## Runs

Types:

- <code><a href="./src/resources/public/runs.ts">RunQueryResponse</a></code>

Methods:

- <code title="get /api/v2/public/{share_token}/run/{run_id}">client.public.runs.<a href="./src/resources/public/runs.ts">retrieve</a>(runID, { ...params }) -> Run</code>
- <code title="post /api/v2/public/{share_token}/runs/query">client.public.runs.<a href="./src/resources/public/runs.ts">query</a>(shareToken, { ...params }) -> RunQueryResponse</code>

# AnnotationQueues

Types:

- <code><a href="./src/resources/annotation-queues/annotation-queues.ts">AnnotationQueueRubricItemSchema</a></code>
- <code><a href="./src/resources/annotation-queues/annotation-queues.ts">AnnotationQueueSchema</a></code>
- <code><a href="./src/resources/annotation-queues/annotation-queues.ts">AnnotationQueueSizeSchema</a></code>
- <code><a href="./src/resources/annotation-queues/annotation-queues.ts">RunSchemaWithAnnotationQueueInfo</a></code>
- <code><a href="./src/resources/annotation-queues/annotation-queues.ts">AnnotationQueueRetrieveResponse</a></code>
- <code><a href="./src/resources/annotation-queues/annotation-queues.ts">AnnotationQueueUpdateResponse</a></code>
- <code><a href="./src/resources/annotation-queues/annotation-queues.ts">AnnotationQueueDeleteResponse</a></code>
- <code><a href="./src/resources/annotation-queues/annotation-queues.ts">AnnotationQueueCreateRunStatusResponse</a></code>
- <code><a href="./src/resources/annotation-queues/annotation-queues.ts">AnnotationQueueExportResponse</a></code>
- <code><a href="./src/resources/annotation-queues/annotation-queues.ts">AnnotationQueuePopulateResponse</a></code>
- <code><a href="./src/resources/annotation-queues/annotation-queues.ts">AnnotationQueueRetrieveAnnotationQueuesResponse</a></code>
- <code><a href="./src/resources/annotation-queues/annotation-queues.ts">AnnotationQueueRetrieveQueuesResponse</a></code>

Methods:

- <code title="get /api/v1/annotation-queues/{queue_id}">client.annotationQueues.<a href="./src/resources/annotation-queues/annotation-queues.ts">retrieve</a>(queueID) -> AnnotationQueueRetrieveResponse</code>
- <code title="patch /api/v1/annotation-queues/{queue_id}">client.annotationQueues.<a href="./src/resources/annotation-queues/annotation-queues.ts">update</a>(queueID, { ...params }) -> unknown</code>
- <code title="delete /api/v1/annotation-queues/{queue_id}">client.annotationQueues.<a href="./src/resources/annotation-queues/annotation-queues.ts">delete</a>(queueID) -> unknown</code>
- <code title="post /api/v1/annotation-queues">client.annotationQueues.<a href="./src/resources/annotation-queues/annotation-queues.ts">annotationQueues</a>({ ...params }) -> AnnotationQueueSchema</code>
- <code title="post /api/v1/annotation-queues/status/{annotation_queue_run_id}">client.annotationQueues.<a href="./src/resources/annotation-queues/annotation-queues.ts">createRunStatus</a>(annotationQueueRunID, { ...params }) -> unknown</code>
- <code title="post /api/v1/annotation-queues/{queue_id}/export">client.annotationQueues.<a href="./src/resources/annotation-queues/annotation-queues.ts">export</a>(queueID, { ...params }) -> unknown</code>
- <code title="post /api/v1/annotation-queues/populate">client.annotationQueues.<a href="./src/resources/annotation-queues/annotation-queues.ts">populate</a>({ ...params }) -> unknown</code>
- <code title="get /api/v1/annotation-queues">client.annotationQueues.<a href="./src/resources/annotation-queues/annotation-queues.ts">retrieveAnnotationQueues</a>({ ...params }) -> AnnotationQueueRetrieveAnnotationQueuesResponsesOffsetPaginationTopLevelArray</code>
- <code title="get /api/v1/annotation-queues/{run_id}/queues">client.annotationQueues.<a href="./src/resources/annotation-queues/annotation-queues.ts">retrieveQueues</a>(runID) -> AnnotationQueueRetrieveQueuesResponse</code>
- <code title="get /api/v1/annotation-queues/{queue_id}/run/{index}">client.annotationQueues.<a href="./src/resources/annotation-queues/annotation-queues.ts">retrieveRun</a>(index, { ...params }) -> RunSchemaWithAnnotationQueueInfo</code>
- <code title="get /api/v1/annotation-queues/{queue_id}/size">client.annotationQueues.<a href="./src/resources/annotation-queues/annotation-queues.ts">retrieveSize</a>(queueID, { ...params }) -> AnnotationQueueSizeSchema</code>
- <code title="get /api/v1/annotation-queues/{queue_id}/total_archived">client.annotationQueues.<a href="./src/resources/annotation-queues/annotation-queues.ts">retrieveTotalArchived</a>(queueID, { ...params }) -> AnnotationQueueSizeSchema</code>
- <code title="get /api/v1/annotation-queues/{queue_id}/total_size">client.annotationQueues.<a href="./src/resources/annotation-queues/annotation-queues.ts">retrieveTotalSize</a>(queueID) -> AnnotationQueueSizeSchema</code>

## Runs

Types:

- <code><a href="./src/resources/annotation-queues/runs.ts">RunCreateResponse</a></code>
- <code><a href="./src/resources/annotation-queues/runs.ts">RunUpdateResponse</a></code>
- <code><a href="./src/resources/annotation-queues/runs.ts">RunListResponse</a></code>
- <code><a href="./src/resources/annotation-queues/runs.ts">RunCreateByKeyResponse</a></code>
- <code><a href="./src/resources/annotation-queues/runs.ts">RunDeleteAllResponse</a></code>
- <code><a href="./src/resources/annotation-queues/runs.ts">RunDeleteQueueResponse</a></code>

Methods:

- <code title="post /api/v1/annotation-queues/{queue_id}/runs">client.annotationQueues.runs.<a href="./src/resources/annotation-queues/runs.ts">create</a>(queueID, [ ...body ]) -> RunCreateResponse</code>
- <code title="patch /api/v1/annotation-queues/{queue_id}/runs/{queue_run_id}">client.annotationQueues.runs.<a href="./src/resources/annotation-queues/runs.ts">update</a>(queueRunID, { ...params }) -> unknown</code>
- <code title="get /api/v1/annotation-queues/{queue_id}/runs">client.annotationQueues.runs.<a href="./src/resources/annotation-queues/runs.ts">list</a>(queueID, { ...params }) -> RunListResponse</code>
- <code title="post /api/v1/annotation-queues/{queue_id}/runs/by-key">client.annotationQueues.runs.<a href="./src/resources/annotation-queues/runs.ts">createByKey</a>(queueID, [ ...body ]) -> RunCreateByKeyResponse</code>
- <code title="post /api/v1/annotation-queues/{queue_id}/runs/delete">client.annotationQueues.runs.<a href="./src/resources/annotation-queues/runs.ts">deleteAll</a>(queueID, { ...params }) -> unknown</code>
- <code title="delete /api/v1/annotation-queues/{queue_id}/runs/{queue_run_id}">client.annotationQueues.runs.<a href="./src/resources/annotation-queues/runs.ts">deleteQueue</a>(queueRunID, { ...params }) -> unknown</code>

## Items

Types:

- <code><a href="./src/resources/annotation-queues/items.ts">ItemCreateResponse</a></code>
- <code><a href="./src/resources/annotation-queues/items.ts">ItemUpdateResponse</a></code>
- <code><a href="./src/resources/annotation-queues/items.ts">ItemListResponse</a></code>
- <code><a href="./src/resources/annotation-queues/items.ts">ItemCreateStatusResponse</a></code>
- <code><a href="./src/resources/annotation-queues/items.ts">ItemDeleteAllResponse</a></code>
- <code><a href="./src/resources/annotation-queues/items.ts">ItemRetrieveCountResponse</a></code>
- <code><a href="./src/resources/annotation-queues/items.ts">ItemRetrievePlacementResponse</a></code>

Methods:

- <code title="post /api/v1/platform/annotation-queues/{queue_id}/items">client.annotationQueues.items.<a href="./src/resources/annotation-queues/items.ts">create</a>(queueID, { ...params }) -> ItemCreateResponse</code>
- <code title="patch /api/v1/platform/annotation-queues/{queue_id}/items/{item_id}">client.annotationQueues.items.<a href="./src/resources/annotation-queues/items.ts">update</a>(itemID, { ...params }) -> ItemUpdateResponse</code>
- <code title="get /api/v1/platform/annotation-queues/{queue_id}/items">client.annotationQueues.items.<a href="./src/resources/annotation-queues/items.ts">list</a>(queueID, { ...params }) -> ItemListResponsesItemsCursorGetPagination</code>
- <code title="post /api/v1/platform/annotation-queues/items/{queue_item_id}/status">client.annotationQueues.items.<a href="./src/resources/annotation-queues/items.ts">createStatus</a>(queueItemID, { ...params }) -> ItemCreateStatusResponse</code>
- <code title="post /api/v1/platform/annotation-queues/{queue_id}/items/delete">client.annotationQueues.items.<a href="./src/resources/annotation-queues/items.ts">deleteAll</a>(queueID, { ...params }) -> ItemDeleteAllResponse</code>
- <code title="get /api/v1/platform/annotation-queues/{queue_id}/items/count">client.annotationQueues.items.<a href="./src/resources/annotation-queues/items.ts">retrieveCount</a>(queueID, { ...params }) -> ItemRetrieveCountResponse</code>
- <code title="get /api/v1/platform/annotation-queues/{queue_id}/items/{item_id}/placement">client.annotationQueues.items.<a href="./src/resources/annotation-queues/items.ts">retrievePlacement</a>(itemID, { ...params }) -> ItemRetrievePlacementResponse</code>

# Info

Types:

- <code><a href="./src/resources/info.ts">InfoListResponse</a></code>

Methods:

- <code title="get /api/v1/info">client.info.<a href="./src/resources/info.ts">list</a>() -> InfoListResponse</code>

# Issues

Types:

- <code><a href="./src/resources/issues.ts">Issue</a></code>

Methods:

- <code title="get /api/v1/platform/issues/{id}">client.issues.<a href="./src/resources/issues.ts">retrieve</a>(id, { ...params }) -> Issue</code>
- <code title="get /api/v1/platform/issues">client.issues.<a href="./src/resources/issues.ts">list</a>({ ...params }) -> IssuesOffsetPaginationIssues</code>

# Sandboxes

Types:

- <code><a href="./src/resources/sandboxes/sandboxes.ts">DownloadURLResponse</a></code>
- <code><a href="./src/resources/sandboxes/sandboxes.ts">SandboxListResponse</a></code>
- <code><a href="./src/resources/sandboxes/sandboxes.ts">SandboxResponse</a></code>
- <code><a href="./src/resources/sandboxes/sandboxes.ts">SandboxStatusResponse</a></code>
- <code><a href="./src/resources/sandboxes/sandboxes.ts">ServiceURLResponse</a></code>
- <code><a href="./src/resources/sandboxes/sandboxes.ts">SnapshotListResponse</a></code>
- <code><a href="./src/resources/sandboxes/sandboxes.ts">SnapshotResponse</a></code>
- <code><a href="./src/resources/sandboxes/sandboxes.ts">SandboxListUsageCostsResponse</a></code>

Methods:

- <code title="get /api/v2/sandboxes/usage/costs">client.sandboxes.<a href="./src/resources/sandboxes/sandboxes.ts">listUsageCosts</a>({ ...params }) -> SandboxListUsageCostsResponsesItemsCursorGetPagination</code>

## Boxes

Types:

- <code><a href="./src/resources/sandboxes/boxes.ts">BoxListServiceURLsResponse</a></code>

Methods:

- <code title="post /api/v2/sandboxes/boxes">client.sandboxes.boxes.<a href="./src/resources/sandboxes/boxes.ts">create</a>({ ...params }) -> SandboxResponse</code>
- <code title="get /api/v2/sandboxes/boxes/{name}">client.sandboxes.boxes.<a href="./src/resources/sandboxes/boxes.ts">retrieve</a>(name) -> SandboxResponse</code>
- <code title="patch /api/v2/sandboxes/boxes/{name}">client.sandboxes.boxes.<a href="./src/resources/sandboxes/boxes.ts">update</a>(name, { ...params }) -> SandboxResponse</code>
- <code title="get /api/v2/sandboxes/boxes">client.sandboxes.boxes.<a href="./src/resources/sandboxes/boxes.ts">list</a>({ ...params }) -> SandboxResponsesItemsCursorGetPagination</code>
- <code title="delete /api/v2/sandboxes/boxes/{name}">client.sandboxes.boxes.<a href="./src/resources/sandboxes/boxes.ts">delete</a>(name) -> void</code>
- <code title="post /api/v2/sandboxes/boxes/{name}/snapshot">client.sandboxes.boxes.<a href="./src/resources/sandboxes/boxes.ts">createSnapshot</a>(name, { ...params }) -> SnapshotResponse</code>
- <code title="delete /api/v2/sandboxes/boxes/{name}/service-urls">client.sandboxes.boxes.<a href="./src/resources/sandboxes/boxes.ts">deleteServiceURL</a>(name, { ...params }) -> void</code>
- <code title="post /api/v2/sandboxes/boxes/{name}/download-url">client.sandboxes.boxes.<a href="./src/resources/sandboxes/boxes.ts">generateDownloadURL</a>(name, { ...params }) -> DownloadURLResponse</code>
- <code title="post /api/v2/sandboxes/boxes/{name}/service-url">client.sandboxes.boxes.<a href="./src/resources/sandboxes/boxes.ts">generateServiceURL</a>(name, { ...params }) -> ServiceURLResponse</code>
- <code title="get /api/v2/sandboxes/boxes/{name}/status">client.sandboxes.boxes.<a href="./src/resources/sandboxes/boxes.ts">getStatus</a>(name) -> SandboxStatusResponse</code>
- <code title="get /api/v2/sandboxes/boxes/{name}/service-urls">client.sandboxes.boxes.<a href="./src/resources/sandboxes/boxes.ts">listServiceURLs</a>(name, { ...params }) -> BoxListServiceURLsResponsesItemsCursorGetPagination</code>
- <code title="post /api/v2/sandboxes/boxes/{name}/start">client.sandboxes.boxes.<a href="./src/resources/sandboxes/boxes.ts">start</a>(name) -> SandboxResponse</code>
- <code title="post /api/v2/sandboxes/boxes/{name}/stop">client.sandboxes.boxes.<a href="./src/resources/sandboxes/boxes.ts">stop</a>(name) -> void</code>

## Registries

Types:

- <code><a href="./src/resources/sandboxes/registries.ts">RegistryListResponse</a></code>
- <code><a href="./src/resources/sandboxes/registries.ts">RegistryResponse</a></code>

Methods:

- <code title="post /api/v2/sandboxes/registries">client.sandboxes.registries.<a href="./src/resources/sandboxes/registries.ts">create</a>({ ...params }) -> RegistryResponse</code>
- <code title="get /api/v2/sandboxes/registries/{name}">client.sandboxes.registries.<a href="./src/resources/sandboxes/registries.ts">retrieve</a>(name) -> RegistryResponse</code>
- <code title="patch /api/v2/sandboxes/registries/{name}">client.sandboxes.registries.<a href="./src/resources/sandboxes/registries.ts">update</a>(name, { ...params }) -> RegistryResponse</code>
- <code title="get /api/v2/sandboxes/registries">client.sandboxes.registries.<a href="./src/resources/sandboxes/registries.ts">list</a>({ ...params }) -> RegistryListResponse</code>
- <code title="delete /api/v2/sandboxes/registries/{name}">client.sandboxes.registries.<a href="./src/resources/sandboxes/registries.ts">delete</a>(name) -> void</code>

## Snapshots

Types:

- <code><a href="./src/resources/sandboxes/snapshots.ts">SnapshotRetrieveByNameResponse</a></code>

Methods:

- <code title="post /api/v2/sandboxes/snapshots">client.sandboxes.snapshots.<a href="./src/resources/sandboxes/snapshots.ts">create</a>({ ...params }) -> SnapshotResponse</code>
- <code title="get /api/v2/sandboxes/snapshots/{snapshot_id}">client.sandboxes.snapshots.<a href="./src/resources/sandboxes/snapshots.ts">retrieve</a>(snapshotID) -> SnapshotResponse</code>
- <code title="get /api/v2/sandboxes/snapshots">client.sandboxes.snapshots.<a href="./src/resources/sandboxes/snapshots.ts">list</a>({ ...params }) -> SnapshotResponsesItemsCursorGetPagination</code>
- <code title="delete /api/v2/sandboxes/snapshots/{snapshot_id}">client.sandboxes.snapshots.<a href="./src/resources/sandboxes/snapshots.ts">delete</a>(snapshotID) -> void</code>
- <code title="get /api/v2/sandboxes/snapshots-by-name/{name}">client.sandboxes.snapshots.<a href="./src/resources/sandboxes/snapshots.ts">retrieveByName</a>(name) -> SnapshotRetrieveByNameResponse</code>
