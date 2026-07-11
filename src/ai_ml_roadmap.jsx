import { useEffect, useMemo, useState } from "react";
import { T, FONT, LAYOUT, ANALOGY, BUTTON, PANEL } from "./sectionStyles.js";

const STORAGE_KEY = "microlab.aiMlRoadmap.progress.v2";

const BLOCKS = [
  { id: "overview", label: "Roadmap", hours: "320–460 total hours" },
  { id: "beginner", label: "Beginner", hours: "90–130 hours" },
  { id: "intermediate", label: "Intermediate", hours: "110–160 hours" },
  { id: "advanced", label: "Advanced", hours: "120–170 hours" },
  { id: "career", label: "Interview & specializations", hours: "Choose a specialization" },
  { id: "resources", label: "Resources", hours: "Reference shelf" },
];

function stableTopicId(sectionId, title) {
  let hash = 2166136261;
  for (const character of title) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return `${sectionId}-${(hash >>> 0).toString(36)}`;
}

const makeSection = (id, block, label, analogy, topics, extra = {}) => ({
  id,
  block,
  label,
  analogy,
  topics: topics.map(([title, explanation]) => ({
    id: stableTopicId(id, title),
    title,
    explanation,
  })),
  ...extra,
});

const SECTIONS = [
  makeSection("map", "overview", "How to use this roadmap", "A roadmap is useful only when it tells you both where to go and how to know you arrived. Move in order through the shared foundations, but use the projects and completion checks as the real gates.", [
    ["Estimated total: 320–460 hours", "The range assumes deliberate practice: reading alone is faster, while implementing, debugging, and documenting the required projects takes most of the time."],
    ["Prerequisites: intermediate Python, linear algebra basics, terminal + Git fluency", "You should be able to write functions and classes, manipulate arrays, reason about matrix shapes, and work comfortably with branches and command-line tools."],
    ["Difficulty: mixed", "The math begins as a gentle refresh, then the steepest sections become model training, distributed systems, evaluation, and reliable production operation."],
    ["Beginner (~90–130 hrs)", "Build mathematical intuition, data discipline, classical ML judgment, neural-network fundamentals, and a reproducible PyTorch workflow."],
    ["Intermediate (~110–160 hrs)", "Learn modern architectures, scalable training, NLP and vision workflows, Hugging Face, fine-tuning, prompting, RAG, and LLM evaluation."],
    ["Advanced (~120–170 hrs)", "Understand LLM internals, serving, agents, distributed training, MLOps, observability, safety, hardware performance, and research practice."],
  ]),
  makeSection("decision-labs", "overview", "Decision labs", "Decision aids are rehearsal spaces: change the assumptions and watch the recommendation move. They do not replace measurement, but they make the trade-offs explicit before an expensive experiment.", [
    ["Metric choice + confusion matrix", "Translate true and false positives and negatives into accuracy, precision, recall, F1, and a metric recommendation tied to error cost."],
    ["Effective batch size + GPU memory planner", "Estimate global batch, learning-rate scaling, and per-GPU model-state plus activation memory before launching a run."],
    ["Prompt vs RAG vs fine-tune decision aid", "Score the three approaches from knowledge freshness, private evidence, citation needs, behavior change, and available examples."],
  ], { kind: "labs" }),
  makeSection("math-toolchain", "beginner", "Math foundations & Python toolchain", "Math is the dashboard, not the engine: you do not calculate every derivative by hand, but you must read the gauges well enough to diagnose training. The toolchain is the workbench that makes each experiment repeatable.", [
    ["Linear algebra: vectors, matrices, dot product, matmul, rank, norms", "Track shapes and geometric meaning: dot products measure alignment, matrix multiplication composes transforms, rank measures independent information, and norms measure size."],
    ["Eigenvalues, eigenvectors, SVD intuition", "Eigenvectors expose invariant directions; SVD generalizes that idea to reveal low-rank structure behind PCA, compression, and conditioning."],
    ["Calculus: derivatives, partial derivatives, chain rule", "A derivative measures sensitivity, partial derivatives isolate one input, and the chain rule propagates sensitivity through a computation graph."],
    ["Gradients, Jacobians, Hessians (intuition, not by hand)", "Gradients point toward local increase, Jacobians collect vector sensitivities, and Hessians describe curvature that affects optimization stability."],
    ["Probability: random variables, expectation, variance, covariance", "Use these to describe uncertain data, typical outcomes, spread, and whether features move together."],
    ["Distributions: Bernoulli, categorical, Gaussian, Beta, Dirichlet", "Match distributions to binary, multi-class, continuous, probability, and probability-vector variables so models encode the right assumptions."],
    ["Bayes’ theorem and conditional probability", "Bayes updates a prior belief with evidence and clarifies the difference between P(A|B) and P(B|A)."],
    ["Information theory: entropy, cross-entropy, KL divergence", "Entropy measures uncertainty, cross-entropy scores predictions against targets, and KL measures directional distribution mismatch."],
    ["Convexity vs non-convexity intuition", "Convex objectives have one global basin; neural-network landscapes are non-convex, so initialization, schedules, and optimization dynamics matter."],
    ["uv for env + lockfiles, pyproject.toml", "Use one fast workflow to create environments, resolve locked dependencies, and keep project metadata in pyproject.toml."],
    ["NumPy arrays, broadcasting, vectorization", "Replace Python loops with shape-aware array operations that are easier to reason about and much faster."],
    ["Polars (preferred) and pandas for tabular data", "Use Polars for fast expression-oriented pipelines while retaining pandas fluency for the wider ecosystem."],
    ["Matplotlib + Seaborn for plotting", "Plot distributions, missingness, relationships, residuals, and learning curves; charts should answer a specific modeling question."],
    ["Marimo notebooks (reactive) alongside Jupyter", "Reactive notebooks reduce hidden state, while Jupyter remains important for compatibility and exploratory workflows."],
    ["scikit-learn API: fit, predict, transform, Pipeline", "Learn the estimator contract so preprocessing and models compose into leakage-safe, deployable pipelines."],
    ["MLflow / W&B for experiment tracking", "Record configuration, code context, metrics, and artifacts so a result can be compared and reproduced rather than remembered."],
    ["GPU check: nvidia-smi, torch.cuda.is_available()", "Verify the driver-visible GPU and the framework-visible accelerator before blaming model code for slow training."],
    ["Prefer uv over conda + pip + requirements.txt workflow", "For this path, one resolver and lockfile reduce environment drift and replace several overlapping dependency tools."],
  ]),
  makeSection("data-eda", "beginner", "Data handling & EDA", "Preparing data is like preparing ingredients: a perfect recipe cannot rescue mislabeled, leaking, or spoiled inputs. Inspect the schema and split logic before selecting a model.", [
    ["Loading CSV / Parquet / JSON / SQLite", "Choose readers deliberately: Parquet preserves types and scans efficiently, while JSON and CSV often need explicit schema cleanup."],
    ["Schema inspection, dtypes, null handling", "Validate column meaning, ranges, types, uniqueness, and missingness before statistics silently operate on the wrong representation."],
    ["Train / validation / test splits (stratified, time-based, group)", "Match the split to deployment: preserve class ratios, keep future out of the past, and prevent the same entity crossing folds."],
    ["Data leakage sources and how to detect them", "Look for post-outcome fields, global preprocessing, duplicates, target-derived features, and split violations that make validation unrealistically easy."],
    ["Class imbalance: resampling, class weights, stratification", "Preserve representative splits, then adjust the learner or sampling while evaluating metrics that reflect minority-class utility."],
    ["Feature scaling: standardize, min-max, robust", "Standard scaling suits many linear methods, min-max bounds values, and robust scaling resists extreme outliers."],
    ["Categorical encoding: one-hot, ordinal, target, hashing", "Choose by cardinality and meaning; protect target encoders with out-of-fold estimates to avoid leakage."],
    ["Missing-value strategies (drop, impute, indicator)", "Treat missingness as a modeling decision: impute from training data and add an indicator when absence itself may be informative."],
    ["Outlier detection (IQR, isolation forest)", "Investigate extremes before deleting them: IQR is transparent for single variables, while isolation forests flag unusual multivariate patterns."],
  ]),
  makeSection("classical-ml", "beginner", "Classical ML", "Classical models are like hand tools: each has a clear shape and failure mode, and the right simple tool often beats a complicated machine. Establish strong baselines before deep learning.", [
    ["Linear regression (closed form + gradient descent)", "Understand least-squares geometry analytically, then optimize the same objective iteratively to connect classical and neural training."],
    ["Logistic regression and the sigmoid", "The sigmoid maps a linear score to probability; regularized logistic regression is a strong, interpretable classification baseline."],
    ["k-NN and the curse of dimensionality", "Prediction follows nearby examples, but distances become less informative as irrelevant dimensions grow, making scaling and feature selection essential."],
    ["Decision trees and entropy / Gini", "Trees recursively split features to reduce impurity; they model nonlinear interactions but overfit without depth and leaf controls."],
    ["Random forests and bagging", "Averaging diverse bootstrap-trained trees lowers variance and supplies a dependable nonlinear baseline."],
    ["Gradient boosting (XGBoost, LightGBM, CatBoost)", "Sequential trees correct prior residuals; these libraries offer strong tabular performance with different speed and categorical-data strengths."],
    ["SVMs and kernel trick intuition", "SVMs maximize margin, while kernels measure similarity in an implicit feature space without materializing every transformed feature."],
    ["Naive Bayes", "Conditional-independence assumptions make training fast and surprisingly effective for sparse text and small datasets."],
    ["k-means, DBSCAN, hierarchical clustering", "Use centroid, density, or tree-based grouping according to cluster shape, noise, and whether the number of groups is known."],
    ["PCA, t-SNE, UMAP for visualization", "PCA preserves linear variance; t-SNE and UMAP reveal local neighborhoods but should not be read as faithful global geometry."],
  ]),
  makeSection("evaluation-features", "beginner", "Model evaluation & feature engineering", "Evaluation is the scoreboard and feature engineering is the playing field. A fair score needs untouched data, while useful features express the structure a model would otherwise struggle to discover.", [
    ["Train / val / test split discipline", "Tune only on training and validation data, then use the untouched test set once for a credible final estimate."],
    ["k-fold and stratified k-fold CV", "Cross-validation estimates variability across splits; stratification stabilizes class proportions for classification."],
    ["Classification metrics: accuracy, precision, recall, F1, ROC-AUC, PR-AUC", "Match the metric to error cost and prevalence: PR-AUC is especially revealing when positives are rare."],
    ["Regression metrics: MAE, MSE, RMSE, R², MAPE", "MAE is robust and interpretable, squared losses punish large misses, R² is relative to a mean baseline, and MAPE fails near zero."],
    ["Confusion matrix reading", "Read true/false positives and negatives before reducing behavior to one number; it exposes which error the model makes."],
    ["Threshold tuning and calibration", "Choose a decision threshold from business costs, and calibrate when reported probabilities must correspond to observed frequencies."],
    ["Bias / variance trade-off", "High bias underfits consistently, while high variance changes too much across samples; capacity and regularization move the balance."],
    ["Learning curves and validation curves", "Learning curves separate data scarcity from underfitting, while validation curves show how one hyperparameter changes train and validation behavior."],
    ["Numerical transforms (log, Box-Cox, binning)", "Transform skewed values, stabilize variance, or encode threshold effects when they better match the relationship to the target."],
    ["Datetime features (cyclical encoding for hour/month)", "Extract calendar structure and encode circular values with sine/cosine so midnight remains close to 23:59."],
    ["Text features (TF-IDF, character n-grams)", "TF-IDF weights distinctive terms and character n-grams handle spelling, morphology, and noisy text with strong sparse baselines."],
    ["Target encoding with leakage protection", "Compute smoothed category statistics out-of-fold and only from training labels."],
    ["Interaction features", "Products, ratios, and grouped combinations expose relationships that additive models cannot represent directly."],
    ["Feature selection (mutual info, L1, permutation importance)", "Compare nonlinear dependence, sparse coefficients, and validation-time shuffling to remove noise without peeking at test data."],
    ["sklearn.pipeline.Pipeline + ColumnTransformer", "Bundle column-specific transforms and the estimator so fitting, cross-validation, and inference apply identical steps."],
    ["Reproducible preprocessing (fit on train only)", "Every learned statistic—vocabulary, mean, scaler, encoder—must be fit inside each training fold."],
  ]),
  makeSection("neural-pytorch", "beginner", "Neural networks & PyTorch fundamentals", "A neural network is an adjustable assembly line: the forward pass produces an answer and backprop assigns responsibility to every adjustment. PyTorch makes those operations explicit enough to inspect.", [
    ["Perceptron and MLP", "A perceptron is a linear decision unit; stacking affine layers and nonlinear activations creates a multilayer perceptron that models nonlinear functions."],
    ["Forward pass and backprop intuition", "The forward pass caches intermediate values, and reverse-mode differentiation applies the chain rule backward to compute parameter gradients."],
    ["Activation functions (ReLU, GELU, SiLU, softmax)", "Hidden activations add nonlinearity with different smoothness, while softmax converts class logits into a probability distribution."],
    ["Loss functions (MSE, cross-entropy, BCE)", "Select a loss that matches continuous, mutually exclusive class, or independent binary targets."],
    ["Optimizers (SGD, momentum, Adam, AdamW)", "SGD can generalize well, momentum smooths updates, Adam adapts per parameter, and AdamW separates weight decay correctly."],
    ["Learning rate, batch size, epochs", "These jointly control update noise, step magnitude, compute, and exposure to the dataset; tune learning rate first."],
    ["Overfitting signals and regularization (L2, dropout, early stopping)", "A widening train-validation gap signals memorization; penalize weights, randomly mask activations, or stop at the best validation checkpoint."],
    ["Weight initialization (Xavier, He)", "Scale initial weights to keep activations and gradients stable; Xavier suits symmetric activations and He suits ReLU-like ones."],
    ["Tensors, dtypes, devices (cpu, cuda, mps)", "Track shape, precision, and device together; mixed devices or unintended dtype promotion are common failures."],
    ["Autograd (requires_grad, backward, no_grad)", "Mark trainable tensors, trigger reverse differentiation from a scalar loss, and disable graph construction during inference."],
    ["nn.Module subclassing", "Register parameters and child layers in a module and define a transparent forward method."],
    ["Dataset and DataLoader", "Datasets define individual examples; data loaders batch, shuffle, parallelize, and collate them for training."],
    ["Training loop anatomy (zero_grad → forward → loss → backward → step)", "Clear accumulated gradients, compute predictions and loss, backpropagate, then update parameters in this exact cycle."],
    ["torch.optim and schedulers", "Optimizers apply gradient updates and schedulers change learning rate over steps or epochs to improve convergence."],
    ["torch.compile for free speedups (2.x)", "Compilation can fuse and optimize stable graphs; measure gains and inspect graph breaks rather than assuming a speedup."],
    ["Saving / loading checkpoints (state_dict)", "Save model, optimizer, scheduler, step, and RNG state so training can resume and inference can be reproduced."],
    ["Use PyTorch 2.x over TensorFlow 1.x-style sessions", "Modern eager PyTorch is the dominant transparent workflow here, with torch.compile narrowing performance gaps without static-session boilerplate."],
  ]),
  makeSection("repro-projects", "beginner", "Reproducibility, projects & completion checks", "A reproducible experiment is a recipe another cook can follow in a different kitchen. The projects prove you can connect data, modeling, evaluation, and evidence instead of completing isolated tutorials.", [
    ["Seed everything (random, NumPy, torch, cudnn.deterministic)", "Seed each RNG and record deterministic settings, while documenting operations that remain nondeterministic or slower."],
    ["Pin versions in pyproject.toml", "Lock direct and transitive packages so future installs do not silently change behavior."],
    ["Track configs (Hydra, pydantic-settings)", "Represent configuration as validated data, separate it from code, and store the exact values with each run."],
    ["Track artifacts (MLflow, W&B, DVC)", "Version datasets, checkpoints, plots, and reports alongside parameters and metrics."],
    ["Deterministic data ordering", "Control sampler seeds, worker initialization, shuffling, and file order so examples arrive consistently."],
    ["Document hardware (GPU model, CUDA, driver)", "Hardware and kernel versions affect speed, numerical behavior, and reproducibility, so include them in run metadata."],
    ["Project 1: tabular-baseline", "Build a real Kaggle-style end-to-end tabular classifier using Pipeline + ColumnTransformer, stratified CV, and a LightGBM baseline that beats logistic regression by at least 3% F1; log MLflow parameters, metrics, and artifacts."],
    ["Project 2: mnist-from-scratch-then-torch", "Implement a NumPy-only MLP with manual backprop to at least 95% test accuracy, then a PyTorch CNN to at least 99%, both seeded and compared in one plot."],
    ["Spot data leakage in someone else’s notebook within 5 minutes", "Use a timed review to identify split, preprocessing, duplicate, temporal, or target-derived leakage and explain the optimistic bias it creates."],
    ["Choose between accuracy, F1, and ROC-AUC for a given problem without googling", "State prevalence, error costs, and whether ranking or a fixed decision matters before selecting the metric."],
    ["Write a PyTorch training loop from scratch without copy-pasting", "Produce a correct train/eval loop with device moves, gradient clearing, mode switches, and metric aggregation unaided."],
    ["Explain bias vs variance using a learning curve you generated", "Diagnose underfitting or data-limited overfitting from train and validation trajectories and propose the next experiment."],
    ["Reproduce a teammate’s experiment from their MLflow run", "Recover code, environment, configuration, data version, and artifact lineage closely enough to match the recorded result."],
    ["Pick the right encoder for a categorical column based on cardinality and target", "Justify one-hot, ordinal, hashing, native categorical, or protected target encoding from semantics, cardinality, and leakage risk."],
  ]),
  makeSection("architectures", "intermediate", "Deep learning architectures", "Architectures are specialized blueprints: convolutions exploit locality, recurrent networks carry state, and transformers connect distant positions directly. Learn the inductive bias before choosing the fashionable name.", [
    ["CNN building blocks (conv, pool, batchnorm, residual)", "Convolutions share local filters, pooling changes resolution, batch normalization stabilizes activations, and residual paths preserve gradient flow."],
    ["ResNet, EfficientNet, ConvNeXt", "Compare residual depth, compound scaling, and modernized convolutional design as three influential vision families."],
    ["RNN, LSTM, GRU and their limits", "Gated recurrence retains sequential state better than vanilla RNNs, but long dependencies and serial computation limit scale."],
    ["Transformer encoder, decoder, encoder-decoder", "Encoders build bidirectional representations, decoders generate causally, and encoder-decoder models condition generation on an input sequence."],
    ["Self-attention, multi-head attention, KV cache", "Attention mixes token information; multiple heads learn different relations, while cached keys and values avoid recomputing the prefix during decoding."],
    ["Positional encodings: sinusoidal, learned, RoPE, ALiBi", "These methods inject order through added vectors, learned tables, rotational phase, or distance-biased attention with different length-extrapolation behavior."],
    ["Vision Transformers (ViT, Swin)", "ViT attends across patches globally, while Swin uses shifted local windows to scale hierarchical vision features."],
    ["Diffusion model basics (DDPM, DDIM)", "Learn iterative denoising as a generative process and how DDIM changes sampling dynamics for faster, often deterministic generation."],
    ["Mixture-of-Experts (MoE) intuition", "A router activates only a subset of expert feed-forward blocks per token, increasing parameter capacity without proportional compute."],
  ]),
  makeSection("scale-tuning", "intermediate", "Training at scale & hyperparameter tuning", "Scaling training is like moving a workshop onto an assembly line: memory, communication, and scheduling become part of the algorithm. Tuning should be a controlled search, not random knob turning.", [
    ["Mixed precision (bf16, fp16, autocast, GradScaler)", "Lower precision reduces memory and increases tensor-core throughput; BF16 has safer range, while FP16 often needs gradient scaling."],
    ["Gradient accumulation", "Sum gradients across microbatches before an optimizer step to emulate a larger effective batch when memory is limited."],
    ["Gradient checkpointing", "Recompute selected forward activations during backward to trade extra compute for substantially lower activation memory."],
    ["Distributed Data Parallel (DDP)", "Replicate the model on each GPU, shard data, and all-reduce gradients; it is the default when a model fits on one device."],
    ["FSDP (Fully Sharded Data Parallel)", "Shard parameters, gradients, and optimizer state across workers so models larger than one GPU can train."],
    ["DeepSpeed ZeRO stages 1/2/3", "Progressively shard optimizer state, gradients, then parameters; higher stages save more memory but communicate more."],
    ["accelerate for boilerplate-free distributed training", "Use Accelerate to centralize device placement, mixed precision, and launcher configuration across local and distributed runs."],
    ["Effective batch size and LR scaling rules", "Compute microbatch × accumulation × data-parallel workers, then test linear or square-root learning-rate scaling rather than applying it blindly."],
    ["Curriculum and data ordering", "Example order changes optimization; curricula move from easier or higher-quality data toward harder data while preserving representative coverage."],
    ["Manual sweeps and intuition first", "Vary one high-impact parameter around a sensible baseline to understand failure modes before automating search."],
    ["Random search vs grid search", "Random search explores more distinct values of important dimensions when only a few hyperparameters matter."],
    ["Bayesian optimization (Optuna)", "Use previous trials to propose promising configurations, especially when each evaluation is expensive."],
    ["ASHA / Hyperband for early stopping", "Allocate small budgets broadly and stop weak trials early so compute concentrates on promising runs."],
    ["Population-based training intuition", "Train a population concurrently, periodically copying strong weights and mutating hyperparameters to adapt schedules online."],
    ["Tracking sweeps in W&B / MLflow", "Store search space, trial lineage, metrics, artifacts, and resource use so conclusions survive beyond the dashboard."],
    ["LR finders (torch_lr_finder)", "Sweep learning rate over a short run and choose a value before loss becomes unstable, then verify with full training."],
    ["Sensible defaults per architecture family", "Start from known optimizer, augmentation, normalization, schedule, and initialization recipes before spending a tuning budget."],
  ]),
  makeSection("nlp-vision", "intermediate", "NLP & computer vision fundamentals", "Text and images are different raw materials: tokenizers turn language into reusable units, while vision pipelines preserve useful spatial variation. Pretrained representations let both domains start from broad experience.", [
    ["Tokenization (BPE, WordPiece, SentencePiece, tiktoken)", "Understand how each tokenizer learns or applies subword vocabularies and how token boundaries affect cost, context length, and model behavior."],
    ["Subword vs word vs char trade-offs", "Words are compact but brittle, characters are robust but long, and subwords balance vocabulary coverage with sequence length."],
    ["Embeddings: word2vec, GloVe, contextual", "Static embeddings assign one vector per token, while contextual models produce a representation conditioned on neighboring words."],
    ["Sentence embeddings (sentence-transformers)", "Train or use pooled representations optimized so semantic similarity can be measured efficiently for retrieval and clustering."],
    ["Sequence labeling (NER, POS)", "Predict a label per token while respecting context for entity extraction and grammatical tagging."],
    ["Text classification with transformers", "Fine-tune a pooled transformer representation for labels while managing truncation, imbalance, and calibration."],
    ["Summarization, translation, QA tasks", "Frame generation around source fidelity, coverage, and task-specific evaluation instead of surface fluency alone."],
    ["Cross-encoder vs bi-encoder", "Bi-encoders precompute independent embeddings for fast retrieval; cross-encoders jointly score pairs for slower, stronger reranking."],
    ["Image preprocessing and augmentation (Albumentations, torchvision.transforms.v2)", "Normalize inputs and apply label-preserving variation consistently, with geometry transformed alongside boxes and masks."],
    ["Transfer learning from pretrained backbones", "Reuse broad visual features, first training a task head and then selectively unfreezing with a smaller learning rate."],
    ["Object detection (YOLOv8/v10, DETR)", "YOLO emphasizes efficient dense prediction, while DETR treats detection as set prediction with transformer matching."],
    ["Segmentation (U-Net, SAM 2)", "U-Net learns dense masks with skip connections; SAM 2 supports promptable segmentation across images and video."],
    ["OCR (docTR, Tesseract for legacy)", "Modern OCR separates detection and recognition with learned models; Tesseract remains useful for clean, conventional documents."],
    ["Video basics (frame sampling, temporal models)", "Sampling controls cost and coverage, while temporal architectures model motion beyond independent-frame features."],
    ["Multimodal: CLIP, SigLIP", "Contrastively align image and text representations for zero-shot classification, retrieval, and multimodal initialization."],
  ]),
  makeSection("huggingface-finetune", "intermediate", "Hugging Face ecosystem & LLM fine-tuning", "The ecosystem is a set of adapters between datasets, models, trainers, and publishing. Fine-tuning is worthwhile when repeated behavior or domain patterns cannot be supplied reliably at inference time.", [
    ["transformers: AutoModel, AutoTokenizer, pipeline", "Use auto classes for architecture-aware loading and pipelines for quick inference, then move to explicit model code for control."],
    ["datasets: load, map, cache, stream", "Build memory-efficient, fingerprinted transforms and stream corpora that are too large to materialize locally."],
    ["accelerate launch configs", "Capture topology and precision in a reusable launch configuration rather than hard-coding device assumptions."],
    ["peft (LoRA, QLoRA, IA³, prefix tuning)", "Adapt a small parameter subset through low-rank updates, quantized bases, activation scaling, or learned prefixes."],
    ["trl (SFT, DPO, ORPO, KTO, GRPO)", "Use task-specific trainers for supervised adaptation, preference alignment, and reward-driven reasoning workflows."],
    ["evaluate for standard metrics", "Load consistent metric implementations and document preprocessing so scores remain comparable."],
    ["Model Hub: pushing models, model cards", "Publish versioned artifacts with intended use, datasets, evaluation, limitations, and reproducibility metadata."],
    ["safetensors over pickle for weights", "Use a non-executable tensor format for faster, safer loading; pickle can execute arbitrary code during deserialization."],
    ["When fine-tuning beats prompting (and when it doesn’t)", "Fine-tune for repeated behavior, style, or learned task patterns; prefer prompting for instructions and RAG for changing factual knowledge."],
    ["Full fine-tuning vs PEFT trade-offs", "Full tuning offers maximum capacity at high memory and storage cost; PEFT is cheaper, modular, and usually the first experiment."],
    ["LoRA / QLoRA mechanics (rank, alpha, target modules)", "Rank controls adapter capacity, alpha scales updates, target modules choose where behavior changes, and QLoRA keeps the frozen base in 4-bit."],
    ["Dataset formatting (chat templates, ShareGPT, Alpaca)", "Normalize roles and turns to the model’s exact chat template and mask tokens that should not contribute to the loss."],
    ["SFT with trl.SFTTrainer", "Supervise the desired response distribution with explicit formatting, packing, masking, evaluation, and checkpoint settings."],
    ["Preference tuning: DPO, ORPO, KTO", "Learn from preferred and rejected behavior using objectives with different reference-model and data requirements."],
    ["Reasoning fine-tuning: GRPO, RLAIF", "Optimize sampled outputs against verifiable or AI-generated rewards while watching reward hacking and distribution collapse."],
    ["Catastrophic forgetting and how to detect it", "Evaluate broad pre-tuning capabilities alongside the target domain and mix replay data or reduce update strength when old skills regress."],
    ["Eval before and after, never just after", "A paired held-out baseline is the only way to attribute gains, regressions, and side effects to tuning."],
  ]),
  makeSection("prompt-rag", "intermediate", "Prompt engineering, structured output & RAG", "Prompting changes the instructions on a desk, RAG adds an open reference book, and fine-tuning changes the worker’s habits. Retrieval quality and output constraints must be evaluated separately from fluent wording.", [
    ["System / user / assistant message structure", "Place durable policy and role in system instructions, the task and data in user content, and examples in correctly labeled turns."],
    ["Few-shot examples and example selection", "Choose representative, diverse, correctly formatted demonstrations; retrieve examples dynamically when the task distribution is broad."],
    ["Chain-of-thought and self-consistency", "Use deliberate decomposition or sample multiple solution paths when it improves accuracy, while evaluating answers rather than depending on exposed hidden reasoning."],
    ["ReAct pattern (reason + act)", "Interleave bounded planning with tool observations so external actions are explicit, validated, and traceable."],
    ["Structured output: JSON mode, function calling, Outlines, Instructor", "Prefer schema-aware generation or validated tool arguments over parsing natural language after the fact."],
    ["Schema-constrained generation", "Constrain decoding to legal tokens for a schema, then validate semantics and business rules after parsing."],
    ["Prompt versioning and registries", "Treat prompts as code: version content, model settings, examples, evaluation results, and rollout status."],
    ["Token budgeting and context window management", "Budget instructions, retrieved evidence, history, and output; trim by value rather than relying on the nominal context limit."],
    ["Chunking strategies (fixed, semantic, recursive, late chunking)", "Choose boundaries that preserve answer-bearing context, then measure retrieval rather than assuming one chunk size."],
    ["Embedding models (BGE, E5, Nomic, Voyage)", "Evaluate domain retrieval, language coverage, vector size, latency, and licensing instead of selecting by a generic leaderboard."],
    ["Vector DBs: Qdrant, Chroma, Weaviate, pgvector, LanceDB", "Compare filtering, persistence, hybrid search, operational fit, and scale; local prototyping needs differ from production."],
    ["Hybrid search (BM25 + dense) with reranking", "Combine exact lexical matches with semantic recall, fuse candidates, then rerank the small set with a stronger pairwise model."],
    ["Cross-encoder rerankers (bge-reranker, cohere-rerank)", "Jointly score query-document pairs after retrieval to improve ordering at a manageable latency cost."],
    ["Query rewriting and HyDE", "Clarify ambiguous queries or embed a hypothetical answer to bridge vocabulary gaps, while guarding against added unsupported assumptions."],
    ["Multi-hop and agentic RAG", "Retrieve iteratively when answering requires linked evidence, but cap steps and retain citations to control latency and drift."],
    ["Evaluation: retrieval metrics + answer faithfulness", "Measure recall, precision, MRR, or nDCG for retrieval separately from citation support, correctness, and completeness of the answer."],
    ["Use Qdrant or pgvector instead of a NumPy vector index", "Production retrieval needs durable storage, metadata filters, concurrency, and hybrid search that a raw in-memory array does not provide."],
  ]),
  makeSection("intermediate-eval-projects", "intermediate", "ML & LLM evaluation, projects & checks", "An evaluation suite is a smoke alarm, not a trophy case: it should catch specific regressions before users do. The intermediate projects prove the complete retrieval and adaptation loops.", [
    ["Holdout, CV, and time-series CV", "Choose an estimator that mirrors deployment and prevents future information, entity overlap, or repeated tuning from contaminating the result."],
    ["Statistical significance (paired t-test, bootstrap CI)", "Use paired comparisons and confidence intervals to distinguish repeatable improvement from sampling noise."],
    ["LLM evals: RAGAS, Promptfoo, DeepEval, lm-eval-harness", "Combine task-specific assertions, RAG measures, regression cases, and standardized benchmarks rather than trusting one aggregate score."],
    ["LLM-as-judge: pairwise + rubric, with bias mitigation", "Blind model identity, randomize order, use explicit rubrics, calibrate against humans, and inspect position and verbosity bias."],
    ["Golden datasets and regression suites", "Curate versioned, representative cases with expected properties so every model, prompt, and retrieval change is tested."],
    ["Red-teaming and jailbreak testing", "Probe adversarial instructions, indirect injection, tool misuse, policy evasion, and multi-turn escalation before release."],
    ["Toxicity, bias, hallucination metrics", "Define harm categories and slice results by affected groups and task; automatic metrics require sampled human review."],
    ["Cost / latency / quality Pareto", "Compare systems on the efficient frontier so a small quality gain is weighed against its token, GPU, and delay cost."],
    ["Project 1: rag-on-your-docs", "Index at least 10k real chunks with hybrid search and a reranker; return cited structured JSON, reach RAGAS faithfulness ≥0.85, stream through FastAPI, and document the latency budget."],
    ["Project 2: qlora-domain-tune", "QLoRA-tune a 7–13B open model on a domain dataset with SFTTrainer and 4-bit bitsandbytes; show ≥5% held-out lift, log W&B, and publish a Hub model card."],
    ["Read a transformer paper and map every block to PyTorch code", "Trace tensor shapes, residual paths, normalization, attention, feed-forward layers, masking, and initialization from notation into executable modules."],
    ["Decide between fine-tuning, RAG, and prompting for a real ask, with reasons", "Base the choice on knowledge freshness, behavior change, labeled examples, latency, privacy, update cadence, and total cost."],
    ["Train a model with FSDP across 2+ GPUs without copy-pasting a script", "Configure wrapping, mixed precision, sharding, distributed sampling, checkpointing, and launch arguments deliberately."],
    ["Build a RAG pipeline with eval that catches regressions in CI", "Fail changes when retrieval, faithfulness, schema validity, latency, or cost breaches explicit thresholds."],
    ["Run a QLoRA fine-tune end-to-end and ship the adapter to HF Hub", "Publish the adapter, base-model reference, chat template, training recipe, evaluation, license, and usage example."],
    ["Diagnose a loss spike (LR, data, precision, gradient explosion) systematically", "Inspect the offending batch, learning-rate transition, gradient norms, scaler state, activations, and distributed logs one hypothesis at a time."],
    ["Write a structured-output generator that never returns invalid JSON", "Use constrained decoding or function calling plus schema validation, retries, and adversarial regression tests."],
  ]),
  makeSection("llm-internals", "advanced", "LLM internals", "An LLM is a factory where most work happens in attention and feed-forward stations. Performance techniques rearrange the same work to move fewer bytes, reuse prefixes, or compute fewer active parameters.", [
    ["Transformer math walkthrough (attention, FFN, residual)", "Follow shapes and parameter counts through projections, scaled dot-product attention, gated or dense feed-forward layers, normalization, and residual addition."],
    ["KV cache, prefix caching, paged attention", "Cache prior keys and values, share common prefixes, and manage cache blocks non-contiguously to reduce recompute and memory fragmentation."],
    ["Rotary embeddings (RoPE) and context extension (YaRN, NTK)", "RoPE encodes relative position through rotation; scaling methods modify frequencies for longer contexts but require perplexity and retrieval validation."],
    ["Flash Attention 2/3", "Tile attention through on-chip memory to avoid materializing the quadratic score matrix, making exact attention faster and more memory efficient."],
    ["Speculative decoding and draft models", "Let a small model propose multiple tokens that the target model verifies in parallel, improving latency when acceptance is high."],
    ["Quantization: GPTQ, AWQ, GGUF, FP8, INT4", "Reduce weight or compute precision with calibration and format-specific kernels, measuring quality, throughput, memory, and hardware support."],
    ["MoE routing and load balancing", "Route tokens to sparse experts while using auxiliary objectives and capacity limits to prevent a few experts from becoming bottlenecks."],
    ["Long-context techniques (sliding window, ring attention)", "Bound local attention or distribute long sequences around devices, then test whether the model actually uses distant evidence."],
  ]),
  makeSection("serving-agents", "advanced", "Inference serving & agent tool use", "Serving is a busy restaurant: batching fills tables efficiently, queues control arrivals, and caches reuse common prep. Agents add trusted tools, so every model-suggested action needs the same validation as an untrusted API request.", [
    ["vLLM, SGLang, TensorRT-LLM, LMDeploy", "Benchmark serving engines on your model and hardware for supported quantization, batching behavior, latency percentiles, and operational complexity."],
    ["Continuous batching and prefix sharing", "Admit new requests between decode steps and reuse identical prompt prefixes to raise throughput without waiting for fixed batches."],
    ["Ollama and llama.cpp for local", "Use simple local packaging and efficient CPU/GPU inference for privacy, offline work, prototypes, and edge-sized models."],
    ["ONNX Runtime, OpenVINO for CPU/edge", "Export optimized graphs and use hardware-specific execution providers where full GPU serving stacks are unavailable."],
    ["Triton Inference Server for multi-model", "Serve versioned model ensembles with dynamic batching, metrics, and multiple framework backends behind one control plane."],
    ["Streaming token responses (SSE, WebSockets)", "SSE is simple for one-way streams; WebSockets suit bidirectional sessions, but both need cancellation, backpressure, and error semantics."],
    ["Batching, queuing, and admission control", "Bound concurrency and token budgets so overload degrades predictably instead of exhausting memory or violating every latency target."],
    ["Autoscaling on GPU (KEDA, Karpenter, Knative)", "Scale from queue and GPU-aware signals while accounting for long model load times, warm capacity, and node availability."],
    ["Microsoft Agent Framework", "Use its orchestration abstractions when integrating Microsoft’s agent and enterprise ecosystem, while keeping tools independently testable."],
    ["Semantic Kernel", "Compose prompts, functions, memory, and planners through typed connectors, with explicit policies around tool execution."],
    ["LangGraph for stateful agent graphs", "Represent cycles, checkpoints, human review, and recovery as an explicit state machine rather than a hidden prompt loop."],
    ["pydantic-ai for typed agents", "Validate inputs, outputs, dependencies, and tool arguments with typed Python models close to business logic."],
    ["Tool / function calling protocols", "Define narrow schemas, validate arguments, authorize by user and context, execute outside the model, and return structured observations."],
    ["MCP (Model Context Protocol) servers and clients", "Expose tools and resources through a standard capability boundary while preserving authentication, least privilege, and audit logs."],
    ["Multi-agent patterns (planner-executor, debate, swarm)", "Use extra agents only when decomposition or independent verification improves outcomes enough to justify cost, latency, and coordination risk."],
    ["Memory: short-term, long-term, episodic, semantic", "Separate transient context, durable user facts, past episodes, and retrieved knowledge with consent, retention, and relevance rules."],
    ["Guardrails (guardrails-ai, nemo-guardrails)", "Apply validated input, output, topic, and action policies around the model, not as a substitute for permission checks in tools."],
  ]),
  makeSection("distributed", "advanced", "Distributed training engineering", "Distributed training is a relay race where communication can cost more than running. The topology and collective operations determine whether extra accelerators increase throughput or simply wait on one another.", [
    ["Cluster topology (NVLink, InfiniBand, PCIe)", "Map fast intra-node and inter-node links before placing parallel groups; bandwidth and latency shape the best sharding plan."],
    ["NCCL collectives (allreduce, allgather, reduce-scatter)", "Understand which tensors move for replicated gradients and sharded parameters so communication volume is predictable."],
    ["Pipeline parallelism, tensor parallelism, sequence parallelism", "Split layers, individual matrix operations, or sequence dimensions according to model size, bubbles, activation memory, and link speed."],
    ["3D parallelism and when to use what", "Combine data, tensor, and pipeline axes only after estimating memory, compute balance, and communication for the actual cluster."],
    ["Checkpoint sharding and resumability", "Write distributed state atomically with topology-independent metadata and test restart before a costly run depends on it."],
    ["Failure recovery and elastic training", "Detect lost workers, preserve sampler and optimizer progress, and re-form process groups without silently duplicating or skipping data."],
    ["Throughput debugging (MFU, HFU)", "Compare achieved compute with hardware peak and algorithmic work, then separate data, kernel, memory, and communication stalls."],
    ["nsight, pytorch profiler, torch.profiler traces", "Use timelines and operator statistics to locate idle gaps, synchronizations, slow kernels, communication, and input bottlenecks."],
  ]),
  makeSection("mlops-observability", "advanced", "MLOps, production & observability", "Production ML is a living supply chain: data changes, models are versioned, traffic shifts, and quality can fail without an exception. Trace both technical health and model behavior from input to decision.", [
    ["Feature stores (Feast, Tecton)", "Centralize feature definitions and point-in-time-correct offline/online retrieval when reuse and low-latency consistency justify the platform."],
    ["Model registry (MLflow, HF Hub, Vertex Registry)", "Track lineage, stage, evaluation, approvals, artifacts, and rollback targets instead of treating a model file as the release."],
    ["CI/CD for models (GitHub Actions + DVC + MLflow)", "Test code, data contracts, reproducibility, metrics, security, and packaging before registering or deploying a candidate."],
    ["Shadow + canary + A/B deploys", "Observe silently, expose a small cohort, then compare randomized variants while retaining fast rollback and guardrail metrics."],
    ["Drift detection: data, concept, prediction (Evidently, NannyML)", "Monitor input distributions, input-output relationships, and output distributions separately because each calls for a different response."],
    ["Online vs batch vs streaming inference", "Choose request-response, scheduled bulk scoring, or event processing from freshness, throughput, state, and latency needs."],
    ["BentoML / KServe / Seldon for packaging", "Evaluate these layers for reproducible model services, Kubernetes integration, inference graphs, rollout, and autoscaling needs."],
    ["Cost monitoring (GPU hours, tokens in/out)", "Attribute training and inference cost by model, tenant, route, and feature so optimization targets economic bottlenecks."],
    ["OpenTelemetry tracing for LLM apps", "Propagate trace context through retrieval, model, tool, and post-processing spans with safe, structured attributes."],
    ["LangSmith, Langfuse, Arize Phoenix, Helicone", "Use an LLM-focused observability layer for traces, datasets, evaluations, prompts, and cost, selected by workflow and data controls."],
    ["Token / latency / cost per request", "Measure input, output, queue, time-to-first-token, total latency, and spend at percentile and route level."],
    ["Prompt + response logging with PII scrubbing", "Redact or tokenize sensitive fields before storage and enforce consent, access, encryption, and retention controls."],
    ["Eval-in-prod (sampling + offline eval)", "Sample representative traces into a reviewed evaluation set and replay them safely against candidate changes."],
    ["Alerting on quality regressions, not just errors", "Page on sustained drops in task success, groundedness, policy compliance, or user outcomes as well as availability."],
    ["Replay and debugging with stored traces", "Reconstruct the exact prompt, evidence, tool calls, model version, settings, and outputs needed to explain a failure."],
  ]),
  makeSection("safety-governance", "advanced", "Safety, security & governance", "Model text is untrusted input, just like text sent to a database. Defenses must sit at every boundary: retrieved content, tool arguments, sensitive logs, model artifacts, and deployment policy.", [
    ["Prompt injection (direct + indirect) and mitigations", "Separate trusted instructions from untrusted content, limit model authority, and test attacks embedded in user input and retrieved documents."],
    ["Data exfiltration via tools and links", "Restrict network and data access, inspect destinations and payloads, and require authorization for sensitive reads or sends."],
    ["PII detection and redaction (Presidio)", "Detect sensitive entities before logging or model transfer, then redact, hash, or tokenize according to purpose and policy."],
    ["Output filtering and policy classifiers", "Use layered detectors and deterministic business rules with calibrated thresholds, appeals, and human escalation."],
    ["Model supply-chain (signed weights, safetensors)", "Verify provenance and signatures, pin revisions, scan dependencies, and load non-executable tensor artifacts."],
    ["License compliance (model + dataset licenses)", "Trace restrictions from training data, base model, adapter, code, and output use before distribution or commercial deployment."],
    ["EU AI Act categories and obligations", "Classify the system’s role and risk, then map applicable documentation, transparency, data, oversight, and monitoring duties with legal review."],
    ["NIST AI RMF, ISO 42001 awareness", "Use these frameworks to organize governance, risk ownership, evidence, lifecycle controls, and continual improvement."],
    ["Red-teaming pipelines (garak, pyrit)", "Automate repeatable adversarial probes, triage exploitable findings, patch controls, and retain regression cases."],
    ["Validate tool-call arguments with Pydantic; sandbox and allowlist actions", "Never execute model-proposed arguments verbatim: validate types and semantics, authorize narrow actions, and isolate execution."],
    ["Prompt injection is the new SQLi", "Distrust tool arguments and retrieved text, then validate, sandbox, and allowlist before they influence privileged operations."],
  ]),
  makeSection("specialized-modeling", "advanced", "Specialized modeling topics", "After the common trunk, specialize by the structure of the signal: time, graph, preference, image, speech, or multiple modalities. Each domain changes the split strategy and evaluation more than the library name.", [
    ["Time series: Nixtla, Prophet, transformer forecasters (TimeGPT, Chronos, Lag-Llama)", "Backtest with rolling origins and compare seasonal statistical baselines with global learned models under realistic horizons."],
    ["Recommender systems: two-tower, sequential, LLM-rerank", "Retrieve candidates efficiently, model user sequence and context, then rerank a small set under relevance, diversity, and latency constraints."],
    ["Graph ML (PyG, DGL)", "Represent entities and relations explicitly, design message passing, and split edges or nodes without leaking graph neighborhoods."],
    ["Reinforcement learning basics (Gymnasium, Stable-Baselines3)", "Learn state, action, reward, policy, value, exploration, and off-policy evaluation through standard environments and baselines."],
    ["RLHF / RLAIF pipelines", "Collect or synthesize preferences, train reward signals, optimize policy behavior, and audit reward hacking and annotator bias."],
    ["Diffusion fine-tuning (DreamBooth, LoRA for SD/Flux)", "Adapt identity or style with small datasets while controlling overfitting, prior preservation, memorization, and licensing."],
    ["Speech: Whisper, Distil-Whisper, TTS (Kokoro, XTTS)", "Evaluate transcription by language and noise, and synthesis by intelligibility, similarity, latency, consent, and misuse risk."],
    ["Multimodal training (LLaVA-style, Qwen-VL)", "Align a vision encoder with a language model, curate instruction data, and test grounding rather than fluent image description alone."],
  ]),
  makeSection("hardware-research", "advanced", "Hardware, performance & research literacy", "A profiler is a flashlight: optimize only after it shows where time and memory go. Research literacy adds a second flashlight for claims, baselines, and evidence.", [
    ["GPU memory math (params + grads + optimizer + activations)", "Estimate persistent model state and shape-dependent activations separately, then include fragmentation, communication buffers, and safety headroom."],
    ["Choosing between H100, H200, B200, MI300X, TPUv5", "Compare supported precision, memory capacity and bandwidth, interconnect, software maturity, availability, and total job cost."],
    ["CPU offload and NVMe offload (DeepSpeed ZeRO-Infinity)", "Move state down the memory hierarchy only when capacity is the blocker and the transfer penalty still meets throughput goals."],
    ["torch.compile modes and graph breaks", "Select compilation modes from startup and steady-state trade-offs, then inspect unsupported operations that fragment graphs."],
    ["Custom CUDA / Triton kernels (intuition)", "Fuse bandwidth-bound operations and tile work for the memory hierarchy only after profiler evidence justifies custom maintenance."],
    ["Profiling: torch.profiler, nsight-systems, nsight-compute", "Move from framework operators to whole-system timelines and then kernel-level occupancy and memory metrics."],
    ["MFU / HFU calculations", "Relate achieved FLOP/s to hardware peak and distinguish model arithmetic from recomputation and auxiliary work."],
    ["Cost per token and cost per training run", "Combine accelerator price, utilization, runtime, retries, storage, network, and serving overhead into comparable unit economics."],
    ["Reading papers efficiently (abstract → figs → results → method)", "Triage the claim and evidence first, then read methods closely only when the result is relevant and credible."],
    ["Reproducing a paper from scratch", "Freeze the target claim, reconstruct data and evaluation, log deviations, and report uncertainty rather than chasing a headline number blindly."],
    ["Spotting overclaims and weak baselines", "Check for cherry-picked tasks, unfair compute, missing simple baselines, leakage, multiple comparisons, and claims broader than experiments."],
    ["Following ArXiv-sanity / HF Daily Papers", "Use feeds for discovery, then filter by durable problems and evidence instead of treating popularity as validation."],
    ["Writing a clean ablation table", "Change one component at a time, keep budgets comparable, report uncertainty, and connect every row to a causal question."],
    ["Open-sourcing a model with weights, code, evals, and a card", "Publish enough versioned data, environment, training, evaluation, limitations, license, and usage detail for independent reproduction."],
  ]),
  makeSection("advanced-projects", "advanced", "Advanced projects & completion checks", "An advanced capstone should survive traffic, failures, hostile inputs, and another engineer’s scrutiny. Passing means operating the system and explaining trade-offs with measured evidence.", [
    ["Project 1: prod-llm-platform", "Build a multi-tenant vLLM API with continuous batching, an OpenAI-compatible endpoint, tenant limits and budgets, OpenTelemetry token traces, injection guardrails, a Helm chart, and ≥99% uptime over a 7-day soak."],
    ["Project 2: agent-with-evals", "Ship a Microsoft Agent Framework or LangGraph agent with ≥5 Pydantic-validated tools, ≥50 golden cases, CI quality gates, Langfuse traces, and autoscaled Azure Container Apps or Cloud Run deployment."],
    ["Choose between LoRA, full FT, continued pretraining, and RAG given constraints, with cost math", "Quantify data, freshness, capability, behavior, memory, training, serving, update, and evaluation costs before recommending an approach."],
    ["Stand up vLLM with continuous batching and hit a documented tokens/sec target", "Define hardware, model, prompts, concurrency, latency percentiles, and quality settings so throughput is reproducible."],
    ["Profile a training run, identify the bottleneck (data, compute, comm), and fix it", "Use traces and utilization evidence, change one bottleneck, and report throughput and cost before and after."],
    ["Detect data drift in production and trigger a retrain workflow automatically", "Use guarded thresholds, quality confirmation, approvals, reproducible data snapshots, and rollback instead of retraining on every alert."],
    ["Red-team your own agent and patch at least one indirect prompt-injection path", "Create a malicious retrieved document, demonstrate the unsafe tool path, then add authorization and a permanent regression test."],
    ["Reproduce a recent paper’s main result within 10% on a small budget", "Scale down transparently, preserve the decisive comparison, quantify variance, and explain remaining implementation or compute differences."],
    ["Run a multi-node FSDP job and recover cleanly from a node failure", "Restore sharded model, optimizer, scheduler, sampler, and step state without corrupting data order or metrics."],
  ]),
  makeSection("interview", "career", "Interview prep", "Interview preparation is a flight simulator: practice making decisions out loud under constraints, not reciting isolated definitions. Strong answers define the objective, expose assumptions, quantify trade-offs, and propose validation.", [
    ["Bias / variance, regularization, and when each fails", "Diagnose learning behavior from evidence and explain when more data, capacity, regularization, or a better split would help or hurt."],
    ["Cross-validation pitfalls (leakage, time series, grouped data)", "Choose folds that respect causality and entities, and place every learned preprocessing step inside the fold."],
    ["Gradient descent variants and why Adam usually wins (and when it doesn’t)", "Compare adaptive steps, momentum, memory, sparse gradients, generalization, and schedule sensitivity rather than naming a default."],
    ["Transformer math: attention complexity, KV cache size, parameter count", "Derive compute and memory from batch, sequence, hidden size, layers, heads, vocabulary, and precision with clear assumptions."],
    ["Tokenization edge cases (BPE merges, unicode, code, emoji)", "Explain how byte fallback and merge boundaries alter token count, truncation, multilingual behavior, and code fidelity."],
    ["RAG vs fine-tune vs long-context decision framework", "Compare freshness, provenance, behavior change, context size, data, latency, security, and ongoing update cost."],
    ["LLM eval design (golden sets, LLM-as-judge bias, statistical significance)", "Build representative cases, blinded calibrated judging, slices, paired comparisons, uncertainty, and regression thresholds."],
    ["ML system design: feature store, training pipeline, online serving, monitoring", "Trace point-in-time data through reproducible training and low-latency serving, then define rollout, drift, quality, and incident controls."],
    ["Recommender / search system design (candidate generation → ranking → reranking)", "Separate high-recall retrieval from richer scoring and final policy, with offline, online, diversity, and feedback-loop evaluation."],
    ["Cost + latency + quality trade-off questions", "Draw the Pareto frontier, define service objectives and budget, then propose measurement, caching, routing, batching, or model changes."],
    ["SQL + data wrangling on a take-home", "Write readable, testable transformations with joins, windows, null handling, grain checks, leakage controls, and validation summaries."],
    ["Coding: implement attention, beam search, or k-means from scratch", "State shapes and invariants, handle numerical stability and edge cases, test tiny examples, then discuss complexity."],
    ["Behavioral / STAR stories on shipped ML systems (3 prepared)", "Prepare three specific stories covering ambiguity, technical failure, cross-functional trade-offs, measured impact, and what you changed afterward."],
    ["Reading a paper live and critiquing methodology", "Summarize the claim, inspect data and baselines, identify threats to validity, and propose the highest-value missing experiment."],
  ]),
  makeSection("applied-llm", "career", "Specialization: Applied LLM Engineering", "Applied LLM engineers turn probabilistic models into bounded product behavior. The specialization centers on retrieval, tools, evaluation, observability, safety, and efficient routing.", [
    ["Microsoft Agent Framework, Semantic Kernel, LangGraph", "Compare ecosystem fit and execution model, but keep state, tools, and evaluation portable enough to avoid framework lock-in."],
    ["Structured output with Instructor, Outlines, JSON schema", "Generate into explicit types, constrain syntax when possible, and validate semantic invariants before downstream use."],
    ["RAG with hybrid search + rerankers + citations", "Build high-recall candidates, precise reranking, evidence packing, and citation checks as separately measured stages."],
    ["Eval harnesses (RAGAS, Promptfoo, DeepEval)", "Combine retrieval and faithfulness measures with deterministic test cases, model comparisons, and CI thresholds."],
    ["Observability (Langfuse, Arize Phoenix, LangSmith)", "Trace full application paths and connect production failures back to versioned datasets and evaluations."],
    ["Guardrails and prompt-injection defense", "Constrain permissions and data flow at application boundaries, then red-team direct and indirect attacks continuously."],
    ["MCP servers for tools and data", "Publish narrow, documented capabilities with authentication, authorization, validation, and resource-level auditability."],
    ["Cost + latency optimization (caching, routing, distillation)", "Reuse stable work, route requests by difficulty, and compress models while measuring quality by slice."],
  ]),
  makeSection("research-foundation", "career", "Specialization: ML Research / Foundation Models", "Research work is controlled skepticism plus careful engineering. Reproduce before extending, measure scaling assumptions, and publish enough evidence for someone else to disagree productively.", [
    ["Reading and reproducing ArXiv papers", "Turn a paper’s central claim into a minimal experiment with matched data, compute, metrics, uncertainty, and documented deviations."],
    ["nanoGPT, litgpt, levanter study", "Read small, clear training stacks to connect transformer equations with data loading, parallelism, checkpointing, and optimization code."],
    ["Custom CUDA / Triton kernels", "Study memory access, tiling, fusion, numerical stability, and benchmarking before optimizing model primitives."],
    ["Scaling laws and compute-optimal training", "Fit loss against data, parameters, and compute to allocate a fixed budget, while checking whether the observed regime matches the assumptions."],
    ["Pretraining data curation and dedup", "Filter quality and policy violations, balance domains, deduplicate near copies, and measure contamination before training."],
    ["Long-context techniques (RoPE scaling, ring attention)", "Compare position extrapolation and distributed attention under retrieval, perplexity, memory, and throughput tests."],
    ["Distillation and model compression", "Transfer teacher behavior to a smaller student through logits, features, or generated data while auditing tail and safety regressions."],
    ["Publishing on HF Hub with full reproducibility", "Release immutable revisions, code, configs, environment, data provenance, checkpoints, evals, license, and a candid model card."],
  ]),
  makeSection("cv-platform", "career", "Specializations: Computer Vision & MLOps / Platform", "Vision specialization follows pixels from annotation to edge deployment; platform specialization builds the paved road that lets many models travel safely. Both demand performance and data-quality measurements, not only architecture knowledge.", [
    ["Detection (YOLOv10, RT-DETR), segmentation (SAM 2)", "Select real-time dense or transformer detection and promptable segmentation from latency, object scale, annotation, and deployment constraints."],
    ["OCR + document AI (docTR, Donut, Nougat)", "Compare modular OCR with end-to-end document understanding for layout, tables, formulas, languages, and evidence traceability."],
    ["Multimodal VLMs (Qwen-VL, InternVL, LLaVA)", "Evaluate spatial grounding, OCR, visual reasoning, hallucination, and resolution cost across representative documents and images."],
    ["Diffusion (SDXL, Flux) fine-tuning with LoRA", "Adapt style or domain efficiently while testing prompt adherence, diversity, memorization, identity leakage, and license constraints."],
    ["Video models (VideoMAE, action recognition)", "Balance temporal sampling, clip length, motion information, label ambiguity, and inference throughput."],
    ["3D / NeRF / Gaussian Splatting basics", "Learn neural fields and explicit Gaussian primitives as different quality, training, rendering, editability, and memory trade-offs."],
    ["Edge inference (CoreML, NNAPI, ONNX Runtime Mobile)", "Convert, quantize, and profile on the target device for supported operators, thermal limits, memory, latency, and energy."],
    ["Kubernetes for ML (KServe, Kubeflow, Ray on K8s)", "Use orchestration when multi-team scheduling, reproducible jobs, serving rollout, and accelerator utilization justify its complexity."],
    ["Ray Train, Ray Serve, Ray Tune", "Share a distributed runtime across training, serving, and tuning while keeping failure handling and resource requests explicit."],
    ["Feature stores (Feast)", "Provide reusable point-in-time feature definitions and consistent online values where duplicated pipelines create real risk."],
    ["DVC + LakeFS for data versioning", "Version file-based datasets and database-like data branches with lineage that ties each model to an immutable snapshot."],
    ["CI/CD: GitHub Actions + MLflow + canary deploys", "Automate tests and registration, then expose candidates gradually under quality, latency, and rollback gates."],
    ["GPU autoscaling (KEDA, Karpenter)", "Translate queues and pod demand into warm accelerator nodes while controlling cold starts, fragmentation, quotas, and spend."],
    ["Drift + quality monitoring (Evidently, NannyML)", "Pair distribution and performance-estimation tools with delayed labels, slices, business outcomes, and retraining policy."],
    ["FinOps for GPUs (spot, reservations, MIG)", "Match interruption tolerance, steady demand, and partitioning to spot capacity, commitments, or GPU slicing."],
  ]),
  makeSection("data-centric", "career", "Specialization: Data-Centric AI", "Data-centric work improves the lesson rather than only changing the student. Audit labels, select informative examples, control synthetic data, and document what the dataset can and cannot support.", [
    ["Label quality auditing (cleanlab)", "Use confident-learning signals to prioritize likely label issues, then confirm them with domain review rather than auto-deleting examples."],
    ["Active learning loops", "Select uncertain, diverse, or high-value examples for annotation and measure gain per labeling cost across repeated rounds."],
    ["Weak supervision (Snorkel)", "Combine noisy labeling functions into probabilistic labels while testing coverage, conflict, correlation, and downstream value."],
    ["Synthetic data generation with LLMs", "Use generation to cover rare cases or bootstrap labels, but detect duplication, artifacts, leakage, and model-induced bias."],
    ["Dataset deduplication and decontamination", "Remove exact and near duplicates across splits and benchmark corpora so evaluation does not reward memorization."],
    ["Data documentation (datasheets, model cards)", "Record purpose, collection, consent, composition, transformations, known gaps, risks, and appropriate uses."],
  ]),
  makeSection("resources", "resources", "Resources", "Resources are reference shelves, not a reading queue. Open the source that answers today’s implementation or conceptual question, then return to building and evaluating.", [
    ["PyTorch official docs", "Use the canonical API reference, recipes, distributed guides, performance notes, and tutorials for current PyTorch behavior."],
    ["Hugging Face transformers docs", "Use for supported architectures, tokenizer behavior, generation controls, training APIs, and loading patterns."],
    ["Hugging Face trl docs", "Use maintained recipes and API details for SFT, DPO, ORPO, KTO, and GRPO workflows."],
    ["Hugging Face peft docs", "Use for LoRA and QLoRA configuration, target-module selection, adapter composition, saving, and inference."],
    ["Hugging Face Learn (NLP, RL, Diffusion, Audio courses)", "Use the free applied courses for guided domain practice with the surrounding ecosystem."],
    ["fast.ai Practical Deep Learning", "Use its top-down PyTorch approach to build useful models quickly before unpacking lower-level details."],
    ["Stanford CS231n", "Use for convolutional, vision-transformer, optimization, detection, and visual-recognition foundations."],
    ["Stanford CS224n", "Use for NLP representation learning, sequence models, transformers, and current language-model foundations."],
    ["Andrej Karpathy ‘Neural Networks: Zero to Hero’ YouTube series", "Use for from-scratch backpropagation, language modeling, and GPT implementation intuition."],
    ["Sebastian Raschka ‘Build a Large Language Model from Scratch’", "Use for a hands-on bridge from transformer components to pretraining and fine-tuning a small LLM."],
    ["‘Designing Machine Learning Systems’ by Chip Huyen", "Use for production data, deployment, monitoring, continual learning, and organizational system-design trade-offs."],
    ["‘Deep Learning’ by Goodfellow / Bengio / Courville", "Use as a theoretical reference for optimization, regularization, probabilistic modeling, and core deep-learning foundations."],
    ["vLLM docs", "Use for supported models, OpenAI-compatible serving, parallelism, quantization, caching, and production configuration."],
    ["lm-evaluation-harness", "Use for standardized language-model task evaluation with pinned prompts, few-shot settings, and reproducible configurations."],
    ["RAGAS docs", "Use for reference and reference-free RAG metrics, dataset construction, evaluator configuration, and interpretation."],
    ["Papers with Code", "Use to discover benchmarks and reference implementations, then verify claims against the paper and maintained source."],
    ["Hugging Face Daily Papers", "Use as a research discovery feed; filter by relevance, evidence, and reproducibility before investing implementation time."],
  ]),
];

const CURRICULUM = SECTIONS.flatMap((section) =>
  section.topics.map((topic) => ({ ...topic, sectionId: section.id, sectionLabel: section.label, block: section.block })),
);

// The roadmap is also a course. These guides are the teaching layer; the detailed
// topic map below each guide remains available for planning and progress tracking.
const SECTION_GUIDES = {
  "math-toolchain": {
    lead: "Modern ML uses automatic differentiation and high-level libraries, but the underlying ideas are not optional. Shapes, uncertainty, and optimization determine whether you can recognize a broken model, choose a loss, or interpret a metric.",
    units: [
      { title: "Linear algebra is the language of data", lesson: "A feature vector x is a row of measurements. A weight vector w says how strongly each measurement influences a prediction, and the dot product w·x combines them into one score. Matrices simply apply many such transformations at once, which is why every neural-network layer is written as a matrix multiplication.", formula: "z = w·x + b", example: "If x = [2, 3] and w = [0.4, −0.1], then z = 0.4×2 − 0.1×3 = 0.5. The sign and size of each weight tell you how that feature changes the score." },
      { title: "Calculus tells a model how to improve", lesson: "Training is repeated measurement and correction. A loss function says how wrong the current prediction is; its derivative says which small change would reduce that error most quickly. The chain rule lets that feedback travel through every layer, which is exactly what backpropagation automates.", formula: "w ← w − η ∂L/∂w", example: "For a prediction that is too large, a positive gradient reduces the weight. The learning rate η controls the step: too large overshoots, too small makes learning painfully slow." },
      { title: "Probability and information quantify uncertainty", lesson: "A classifier should not only name a class; it should report how confident it is. Cross-entropy compares the probability assigned to the correct answer with what actually happened, while KL divergence measures how far two probability distributions differ.", formula: "L = −Σ yᵢ log(pᵢ)", example: "If the true class receives probability 0.90, the loss is small. If it receives 0.01, the loss is large, so the model receives a strong correction." },
      { title: "The toolchain makes the reasoning repeatable", lesson: "Use uv and pyproject.toml to pin the exact environment, NumPy to reason about array shapes, Polars or pandas to inspect data, and scikit-learn Pipelines to keep preprocessing attached to the model. Tracking runs in MLflow or W&B turns an experiment from a memory into evidence.", example: "A reproducible run records the dataset version, split seed, package lockfile, GPU, parameters, metrics, and saved model—not only the final score." },
    ],
    practice: ["Implement a two-feature linear predictor with NumPy and print every intermediate shape.", "Derive one gradient by hand for mean-squared error, then verify it with PyTorch autograd.", "Create a tiny uv project whose pyproject.toml, plot, and run metadata recreate the same result twice."],
  },
  "data-eda": {
    lead: "Most model failures begin before model code exists. Treat the dataset as an instrument that can be miscalibrated: inspect what each column means, decide what information is available at prediction time, and test whether the split resembles the real future.",
    units: [
      { title: "Start with the prediction contract", lesson: "Write down the target, prediction time, unit of observation, and acceptable error before loading data. This immediately exposes forbidden columns: any field created after the outcome, or aggregated using future records, is leakage.", example: "For churn prediction on 1 July, a support ticket opened on 15 July cannot be a feature—even if it predicts churn perfectly." },
      { title: "Choose the split that matches deployment", lesson: "Random splits work only when rows are independent and identically distributed. Use stratification for rare classes, group splits when one customer or patient has many rows, and time-based splits whenever tomorrow is the real test.", example: "A time-series model trained through March should validate on April and test on May; shuffling lets it learn the future." },
      { title: "Preprocess inside the training fold", lesson: "Imputation, scaling, encoding, feature selection, and outlier rules learn from data. Fit them only on training rows, then apply the frozen transform to validation and test rows through a Pipeline or ColumnTransformer.", example: "Computing a global mean before splitting leaks information from validation data into every standardized training example." },
    ],
    practice: ["Audit a CSV for duplicate IDs, missingness, impossible ranges, and target leakage.", "Compare a random split with a time-based split and explain why their scores differ.", "Build a Pipeline with numeric imputation, categorical encoding, and a baseline classifier."],
  },
  "classical-ml": {
    lead: "Classical ML is the control group for every ambitious model. It gives fast baselines, exposes data problems, and teaches the trade-offs that deep learning still inherits: capacity, distance, margin, impurity, and uncertainty.",
    units: [
      { title: "Fit the simplest credible baseline", lesson: "Linear and logistic regression answer a useful first question: can an additive relationship solve the task? They are fast, interpretable, and often surprisingly competitive after good preprocessing.", formula: "p(y=1|x) = 1 / (1 + e^(−z))", example: "A logistic model can show whether income, tenure, and support contacts independently predict churn before you add nonlinear trees." },
      { title: "Use trees for nonlinear tabular structure", lesson: "Trees split the data into regions; random forests reduce variance by averaging many trees; boosting builds trees sequentially to correct prior errors. Compare them with a held-out validation set rather than assuming a library wins.", example: "CatBoost may simplify high-cardinality categories, while LightGBM may train faster on a large numeric table." },
      { title: "Cluster and project with a question in mind", lesson: "PCA summarizes linear variance. t-SNE and UMAP are visualization tools for local neighborhoods, not proof of real clusters. Clustering should lead to a follow-up test: are the discovered groups stable and useful?", example: "A UMAP island might reflect batch effects instead of a meaningful customer segment." },
    ],
    practice: ["Benchmark logistic regression, random forest, and gradient boosting using the same Pipeline and split.", "Plot PCA before t-SNE or UMAP, then label any clusters with original features.", "Explain when k-NN becomes unreliable as feature dimension increases."],
  },
  "evaluation-features": {
    lead: "A good score is an argument, not a number. You need a metric that reflects the harm of each error, a validation design that mimics use, and features that are available and reproducible at inference time.",
    units: [
      { title: "Read the confusion matrix before the headline metric", lesson: "Accuracy hides the distribution of errors. Precision answers “when we alert, how often are we right?”; recall answers “how many true cases did we catch?”; F1 balances the two; ROC-AUC and PR-AUC evaluate ranking across thresholds.", example: "For fraud with 1% positives, 99% accuracy can be achieved by predicting no fraud at all. Recall and PR-AUC reveal that failure." },
      { title: "Diagnose bias and variance with curves", lesson: "If both training and validation error are high, the model or features underfit. If training error is low but validation error is high, the model may memorize. Learning curves show whether more data is likely to help; validation curves show which knob is unstable.", example: "A growing validation gap after epoch 12 suggests early stopping, regularization, or more data—not simply more epochs." },
      { title: "Engineer features without leaking the answer", lesson: "Transforms can expose scale, seasonality, text patterns, interactions, and categorical structure. Every feature must be computed from information known at the prediction time and fitted only within the training partition.", example: "Encode hour-of-day as sin and cos so 23:00 and 00:00 are neighbors instead of opposite ends of a number line." },
    ],
    practice: ["Use the metric lab to change false positives and false negatives, then justify a threshold.", "Create a learning curve for an underfit and an overfit model.", "Add a target encoder safely with out-of-fold training statistics."],
  },
  "neural-pytorch": {
    lead: "Neural networks are not magic functions; they are repeated linear transformations, nonlinear gates, and a disciplined optimization loop. PyTorch makes every part inspectable, which is why it is the best place to learn the mechanics.",
    units: [
      { title: "Forward pass: turn inputs into logits", lesson: "Each layer maps a batch of features to a new representation. Activations such as ReLU, GELU, and SiLU let stacked layers model nonlinear relationships. The final layer produces logits; the loss interprets them for the task.", formula: "h = activation(Wx + b)", example: "For ten digit classes, a network emits ten logits. Cross-entropy compares their softmax probabilities with the true digit." },
      { title: "Backward pass: assign credit", lesson: "Autograd builds a computation graph during the forward pass. Calling backward on a scalar loss accumulates a gradient for every trainable parameter; the optimizer then takes one update step.", example: "Always call zero_grad before the next batch, otherwise gradients accumulate and you silently change the effective update." },
      { title: "Control generalization and stability", lesson: "Initialization keeps early signals from exploding or vanishing. Learning rate, batch size, weight decay, dropout, schedulers, and early stopping determine how quickly the model learns and whether it memorizes.", example: "AdamW with a small validation-driven schedule is a common default, but it still needs a baseline and a learning-rate check." },
    ],
    practice: ["Write a Dataset, DataLoader, nn.Module, train loop, and evaluation loop without a notebook template.", "Deliberately overfit 20 examples, then verify the loss can approach zero.", "Save and reload a state_dict with optimizer, scheduler, epoch, and random-state metadata."],
  },
  "repro-projects": {
    lead: "A result you cannot reproduce is not an engineering result. These projects are deliberately end-to-end: they test data discipline, metrics, training, documentation, and the ability to explain a decision later.",
    units: [
      { title: "Reproducibility has layers", lesson: "Seed random number generators, pin packages, track configuration, control data ordering, and record hardware. Deterministic execution may cost speed, so document exactly what is deterministic and what is only best-effort reproducible.", example: "A checkpoint without the split seed and preprocessing version cannot recreate a result even if the weights are available." },
      { title: "Tabular baseline project", lesson: "Start with an honest Kaggle-style dataset, build a leakage-safe Pipeline, compare logistic regression and LightGBM under stratified cross-validation, and log metrics and artifacts. The goal is not a leaderboard score; it is a defensible baseline that another person can rerun.", example: "Report mean and spread of F1 across folds, not a single lucky split." },
      { title: "MNIST twice, for two different lessons", lesson: "A NumPy MLP teaches forward/backward mechanics. A PyTorch CNN teaches data loading, convolution, device handling, and standard training practice. Comparing them teaches why frameworks are useful without hiding the math.", example: "Keep the seed, train/test split, and evaluation plot common so the comparison is meaningful." },
    ],
    practice: ["Recreate an experiment from its MLflow run without asking the original author for code changes.", "Write a short run card: data, split, environment, hardware, parameters, metrics, artifacts, limitations.", "Review another notebook for leakage in five minutes and write the evidence you found."],
  },
  "architectures": {
    lead: "Architectures encode assumptions about structure. A convolution assumes nearby pixels relate, a recurrent model assumes a sequential state, and a transformer assumes relationships can span the whole context. Choose the assumption before the brand name.",
    units: [
      { title: "From CNNs to Transformers", lesson: "CNNs use local filters and translation-friendly feature hierarchies. Vision Transformers turn image patches into tokens and learn global interactions; Swin restores locality with shifted windows for efficiency.", example: "For a small labeled image dataset, transfer learning from a pretrained CNN can beat training a ViT from scratch." },
      { title: "Attention, position, and decoding", lesson: "Self-attention lets every token weigh other tokens. Multi-head attention learns several relations at once; positional encodings, RoPE, and ALiBi give the model an order; KV caching prevents recomputing the prompt during generation.", formula: "Attention(Q,K,V) = softmax(QKᵀ / √d)V", example: "A decoder can reuse cached keys and values from a 4,000-token prompt while generating each new token." },
      { title: "Generative capacity without full compute", lesson: "Diffusion learns to reverse noise into data. Mixture-of-Experts activates only a few expert blocks per token, increasing capacity while keeping active compute lower than a dense model of the same parameter count.", example: "Both need careful evaluation: attractive samples or a low average loss can still hide mode collapse, routing imbalance, or unsafe outputs." },
    ],
    practice: ["Map an encoder-only, decoder-only, and encoder-decoder task to the right architecture.", "Trace tensor shapes through one attention block.", "Compare a ResNet transfer-learning baseline with a small ViT on the same split."],
  },
  "scale-tuning": {
    lead: "Scaling does not mean “use more GPUs.” It means accounting for precision, memory, communication, batch size, and the experiment budget so extra hardware actually increases useful throughput.",
    units: [
      { title: "Spend memory deliberately", lesson: "Mixed precision reduces model and activation memory. Gradient accumulation simulates a larger batch, while checkpointing trades extra computation for lower activation storage. The compute planner gives a first estimate; a profiler decides whether it is true.", example: "A model that does not fit may need FSDP and checkpointing before it needs a smaller batch." },
      { title: "Pick the smallest distributed strategy that works", lesson: "DDP is simple when the full model fits per GPU. FSDP and ZeRO shard state when it does not. Accelerate centralizes device and precision boilerplate, but it does not remove the need to understand samplers, checkpoints, and failure recovery.", example: "Changing from DDP to FSDP affects checkpoint format, effective batch, communication, and debugging—not only memory." },
      { title: "Tune as an experiment", lesson: "Manual sweeps build intuition; random search samples more useful combinations than grids; Bayesian optimization and ASHA reduce expensive trial waste. Always record the search space, stopping rule, seeds, and compute consumed.", example: "A trial that stops early due to ASHA should not be compared as if it had the same training budget as the winner." },
    ],
    practice: ["Calculate effective batch size and a learning-rate hypothesis for a multi-GPU run.", "Run a short mixed-precision comparison and measure memory, throughput, and loss stability.", "Use Optuna or a random sweep only after defining a fixed validation protocol."],
  },
  "nlp-vision": {
    lead: "NLP and vision pipelines turn raw human data into consistent model inputs. Their most important design decisions are often data representation, augmentation, and evaluation—not the final backbone.",
    units: [
      { title: "Tokenization sets the unit of language", lesson: "BPE, WordPiece, SentencePiece, and tiktoken break text into reusable subwords. The choice changes token cost, multilingual behavior, code handling, and the effective context window. Sentence embeddings and cross-encoders then solve different retrieval speed-versus-quality problems.", example: "A bi-encoder can search millions of documents quickly; a cross-encoder reranks the top candidates more accurately." },
      { title: "Vision starts with data geometry", lesson: "Normalization and augmentation must preserve labels. A crop that is harmless for classification may invalidate a detection box, so transforms must update images, masks, and boxes together.", example: "Use transfer learning first: train a new head, inspect errors, then unfreeze selectively with a lower learning rate." },
      { title: "Choose task-specific evidence", lesson: "Detection needs box quality and recall, segmentation needs mask overlap, OCR needs text accuracy, video needs temporal coverage, and multimodal models need grounded image-text tests. A single accuracy score is rarely enough.", example: "A model that captions a photo fluently may still misread the small text that matters to an OCR task." },
    ],
    practice: ["Tokenize the same English, code, and emoji string with two tokenizers and compare length.", "Apply an augmentation to an image and its bounding boxes, then visually verify alignment.", "Benchmark bi-encoder retrieval followed by cross-encoder reranking on a small labeled set."],
  },
  "huggingface-finetune": {
    lead: "The Hugging Face stack is useful because it makes the model, tokenizer, dataset, trainer, accelerator, and published artifact explicit. Fine-tuning is a controlled behavior change—not a substitute for fresh knowledge or good evaluation.",
    units: [
      { title: "Make the data and template match", lesson: "The tokenizer and chat template define what the model sees. Normalize ShareGPT or Alpaca-like examples into the target format, mask tokens that should not be learned, and inspect actual tokenized samples before running a job.", example: "A mismatched assistant boundary can train the model to continue the user message rather than answer it." },
      { title: "Start with parameter-efficient adaptation", lesson: "LoRA trains small low-rank updates; QLoRA keeps the base model quantized to lower memory; IA³ and prefix tuning change other small parameter sets. Full fine-tuning costs more and should earn its extra complexity with a measured improvement.", example: "Rank and target modules decide adapter capacity; increasing them without a held-out evaluation only increases cost." },
      { title: "Evaluate side effects", lesson: "SFT, DPO, ORPO, KTO, GRPO, and RLAIF optimize different signals. Evaluate target behavior before and after tuning, but also test broad capabilities and safety to detect catastrophic forgetting or reward hacking.", example: "A domain-tuned model can improve terminology while becoming worse at basic instruction following if the data is narrow." },
    ],
    practice: ["Inspect ten tokenized chat examples before launching SFT.", "Run a small LoRA rank sweep and plot quality versus memory and training time.", "Write a model card that states the base model, dataset, template, evaluation, limitations, and license."],
  },
  "prompt-rag": {
    lead: "Prompting, RAG, and fine-tuning solve different problems. The useful question is not “which is best?” but “which component changes instructions, brings current evidence, or changes a repeated behavior?”",
    units: [
      { title: "Prompts are executable interfaces", lesson: "Separate durable system policy, task-specific user content, examples, tools, and output schema. Version every change and test it against a golden set, because a prompt is a production dependency rather than a paragraph of prose.", example: "A few-shot example should match the requested output schema and edge cases, not merely demonstrate a happy path." },
      { title: "Structured output protects downstream systems", lesson: "JSON mode, function calling, Outlines, Instructor, and schema-constrained generation reduce syntax failures. They still require semantic validation: a well-formed amount, URL, or tool call can be unsafe or wrong.", example: "Validate an extracted date range, authorize the operation, and only then let a tool use it." },
      { title: "RAG is an information-retrieval system first", lesson: "Chunking, embeddings, hybrid BM25+dense search, reranking, query rewriting, and citations all influence answer quality. Measure retrieval recall and ranking separately from faithfulness and final-answer usefulness.", example: "If the needed document never enters the candidate set, no larger generator or clever prompt can cite it correctly." },
    ],
    practice: ["Use the approach chooser for a changing, cited knowledge task and explain its recommendation.", "Build a small hybrid retriever, then compare recall before and after a cross-encoder reranker.", "Add a JSON schema and a semantic validator to one model-backed workflow."],
  },
  "intermediate-eval-projects": {
    lead: "LLM evaluation must catch regressions before users do. Treat a golden set, a retrieval benchmark, and a red-team suite as versioned test assets—not as an end-of-project demo.",
    units: [
      { title: "Separate measurement layers", lesson: "Holdout or time-series validation tests generalization. Bootstrap confidence intervals and paired tests test whether a change is likely real. RAGAS, Promptfoo, DeepEval, and lm-eval-harness cover different layers, so combine them rather than seeking one universal score.", example: "A RAG change can raise answer fluency while lowering citation faithfulness; separate metrics reveal the trade-off." },
      { title: "Build systems that can fail safely", lesson: "Golden cases, schema checks, latency budgets, toxicity and jailbreak probes, and regression thresholds belong in CI. LLM-as-judge can scale review, but needs a rubric, random order, calibration against people, and bias checks.", example: "A quality gate can block deployment when faithfulness falls or p95 latency exceeds the stated budget." },
      { title: "Make the intermediate projects operational", lesson: "The RAG project proves retrieval, citations, streaming, and evaluation at realistic corpus size. The QLoRA project proves that adaptation has a held-out lift, a documented training run, and a reusable artifact.", example: "A 5% lift is only meaningful when it comes from a held-out set and the comparison uses the same prompt or evaluator." },
    ],
    practice: ["Create ten golden examples with expected evidence, structured output, and failure cases.", "Run a paired before/after evaluation and report a confidence interval.", "Write a CI rule that fails when a regression exceeds an agreed threshold."],
  },
  "llm-internals": {
    lead: "LLM internals matter because performance and context limits are not mysterious. They follow from attention’s quadratic work, cache memory, precision, active parameters, and the way requests are scheduled.",
    units: [
      { title: "Trace one transformer block", lesson: "Tokens become embeddings, attention mixes context, an FFN transforms each token, and residual paths keep the original signal available. Parameter count and memory follow directly from hidden size, layer count, vocabulary, and precision.", example: "Doubling context length roughly quadruples dense attention work, while KV cache grows linearly with generated context." },
      { title: "Reuse work during generation", lesson: "KV caches, prefix caches, paged attention, FlashAttention, and speculative decoding avoid recomputing or moving unnecessary data. They improve throughput only when the workload, batching policy, and hardware permit reuse.", example: "Two users with the same long system prompt can share a cached prefix instead of paying to process it twice." },
      { title: "Trade precision, capacity, and quality honestly", lesson: "GPTQ, AWQ, GGUF, FP8, and INT4 reduce memory and can improve throughput, but require task-specific quality tests. MoE increases total capacity by routing to a few experts, which adds load-balancing and serving complexity.", example: "A quantized model may preserve general chat quality but fail on a narrow reasoning or multilingual slice." },
    ],
    practice: ["Estimate KV-cache memory for one model, context length, batch, and precision.", "Compare dense attention, sliding-window attention, and ring attention for a long-context workload.", "Benchmark a quantized model on a representative quality set before choosing it for serving."],
  },
  "serving-agents": {
    lead: "Inference is a queueing and systems problem. Agents add another layer: a model can suggest actions, but only the application may authorize and execute them.",
    units: [
      { title: "Serve according to the workload", lesson: "vLLM, SGLang, TensorRT-LLM, LMDeploy, Triton, Ollama, llama.cpp, ONNX Runtime, and OpenVINO target different hardware and deployment constraints. Choose from model support, batch behavior, latency, operational maturity, and whether the workload is cloud, local, CPU, or edge.", example: "Continuous batching improves throughput when requests arrive steadily; it can hurt tail latency if admission control is missing." },
      { title: "Stream and protect capacity", lesson: "SSE and WebSockets let clients see generated tokens early. Queues, batching, rate limits, budgets, and autoscaling protect the service when demand spikes; observe token throughput and tail latency rather than only average latency.", example: "A request that starts quickly but stalls after 50 tokens is a user-visible failure even if average latency looks acceptable." },
      { title: "Treat tool calls as untrusted requests", lesson: "Agent frameworks coordinate state and tools, but no framework replaces argument validation, least privilege, timeouts, sandboxing, audit logs, and human approval where needed. Memory should have retention and consent rules.", example: "A retrieved web page can contain an instruction to export data; it is evidence to inspect, not authority to execute." },
    ],
    practice: ["Define an SLO for first-token latency, tokens/sec, and error rate for a test endpoint.", "Implement one tool schema with validation, authorization, timeout, and audit logging.", "Load-test continuous batching with several prompt lengths and inspect p50 and p95 latency."],
  },
  "distributed": {
    lead: "Distributed training succeeds when hardware topology, parallelism strategy, data loading, and checkpointing agree. Adding GPUs without measuring communication simply creates more expensive waiting.",
    units: [
      { title: "Know where bytes travel", lesson: "NVLink, PCIe, and InfiniBand have very different bandwidth and latency. NCCL collectives such as all-reduce, all-gather, and reduce-scatter synchronize gradients or shards; their cost shapes which parallelism is worthwhile.", example: "A model that is compute-bound on one node can become communication-bound across slow interconnects." },
      { title: "Compose parallelism deliberately", lesson: "Data parallelism scales replicas, tensor parallelism splits layer math, pipeline parallelism splits layers across stages, and sequence parallelism partitions long activations. 3D parallelism combines them when a single strategy cannot fit or feed the model.", example: "Pipeline stages need balanced work; one slow stage stalls every other accelerator." },
      { title: "Design for restart, not only success", lesson: "Sharded checkpoints must restore model, optimizer, scheduler, sampler, and data position. Elastic training and failure recovery are engineering requirements for long jobs, not optional polish.", example: "A resumed job with a different sampler order can silently duplicate or skip data and invalidate the learning curve." },
    ],
    practice: ["Read one profiler trace and classify time as data, compute, or communication.", "Explain when DDP, FSDP, tensor parallelism, and pipeline parallelism are appropriate.", "Kill a small distributed run intentionally and verify a checkpointed resume matches the expected step."],
  },
  "mlops-observability": {
    lead: "Production ML is a feedback loop: versioned data becomes a model, a model serves traffic, traffic reveals drift and quality, and monitoring tells you whether to investigate, roll back, or retrain.",
    units: [
      { title: "Make artifacts traceable", lesson: "Feature stores, registries, DVC, CI/CD, and packaging tools create lineage between a feature definition, data snapshot, training configuration, model version, and deployment. That lineage is what makes rollback and diagnosis possible.", example: "A canary deployment should name the exact model, prompt, retrieval index, and evaluator version that produced each response." },
      { title: "Monitor input, relationship, and output drift", lesson: "Data drift means inputs change; concept drift means the input-output relationship changes; prediction drift means the model’s output distribution changes. They require different responses and none proves quality has changed without labels or direct evaluation.", example: "A traffic-source change can move input distributions while accuracy stays stable; an unobserved policy change can hurt accuracy without obvious input drift." },
      { title: "Observe the full request", lesson: "OpenTelemetry and tools such as Langfuse, LangSmith, Phoenix, and Helicone connect prompts, retrieval, tools, latency, tokens, cost, and sampled quality evaluations. Scrub PII before logging and alert on quality regressions, not only exceptions.", example: "A replayable trace can show that an answer failed because retrieval returned no evidence, not because the model ignored good evidence." },
    ],
    practice: ["Draw the lineage from raw data to a canary deployment and rollback.", "Define one data-drift, one quality, and one cost alert with an owner and response playbook.", "Trace a failed RAG answer through retrieval, prompt construction, generation, and evaluation."],
  },
  "safety-governance": {
    lead: "Safety is not a prompt at the top of a model call. It is a set of boundaries around data, privileges, model artifacts, logs, outputs, and human accountability.",
    units: [
      { title: "Defend against prompt injection", lesson: "Direct injection comes from a user; indirect injection comes from retrieved documents, web pages, files, or tool output. Treat all of it as untrusted data, separate instructions from evidence, validate tool arguments, and allowlist the actions the application permits.", example: "The model may summarize a document that says “send all records to this URL,” but the tool layer must reject the unapproved export." },
      { title: "Protect information and artifacts", lesson: "Minimize collection, detect and redact PII, control retention, and filter outputs according to policy. Use signed or trusted model artifacts and safetensors where appropriate; review model and dataset licenses before shipping.", example: "A trace useful for debugging should store a redacted identifier rather than raw account numbers or private text." },
      { title: "Govern the lifecycle", lesson: "EU AI Act obligations, NIST AI RMF, ISO 42001, red-teaming tools such as Garak and PyRIT, and internal risk reviews provide structure. The important outcome is evidence: known risks, owners, tests, incident paths, and ongoing monitoring.", example: "A red-team finding should become a regression case and a tracked remediation, not a one-time report." },
    ],
    practice: ["Create an indirect-injection test document and verify your tool layer rejects its unsafe request.", "Write a PII logging policy for prompts, responses, and traces.", "Turn one red-team finding into a permanent automated test."],
  },
  "specialized-modeling": {
    lead: "Specialization begins with the structure of the data and decision, not with a trendy library. Time, graph topology, feedback, images, speech, and multiple modalities all require different splits, labels, and failure analysis.",
    units: [
      { title: "Forecast and rank with realistic temporal feedback", lesson: "Time-series models need walk-forward validation and a clear forecast horizon. Recommenders separate candidate retrieval, ranking, reranking, exploration, and delayed feedback; offline relevance alone can create harmful online loops.", example: "A model that predicts yesterday’s demand well may be useless if its feature latency makes it unavailable at tomorrow’s decision time." },
      { title: "Respect graph and reinforcement structure", lesson: "Graph ML propagates information along edges, so train/test splits must prevent leaking connected neighborhoods. Reinforcement learning optimizes a policy through reward, but offline evaluation, exploration risk, and reward misspecification are central problems.", example: "Randomly splitting nodes in a citation graph can leak the test node’s neighborhood into training." },
      { title: "Evaluate generative, speech, and multimodal systems by use", lesson: "Diffusion adaptation, ASR, TTS, and vision-language models need more than attractive samples. Test identity, grounding, transcription error, consent, latency, safety, and the task’s real output quality.", example: "A multimodal model should be tested on whether it points to the correct region or source, not only whether its caption sounds plausible." },
    ],
    practice: ["Build a walk-forward split for one forecasting task.", "Explain a graph split that avoids neighborhood leakage.", "Define task-specific metrics for OCR, speech transcription, and a vision-language question-answering task."],
  },
  "hardware-research": {
    lead: "Hardware knowledge prevents expensive surprises, and research literacy prevents persuasive but weak claims. In both cases, measure the bottleneck, state assumptions, and compare against an honest baseline.",
    units: [
      { title: "Account for memory before launch", lesson: "Persistent state includes weights, gradients, and optimizer state; activations depend on batch, sequence, hidden size, layers, precision, and checkpointing. CPU/NVMe offload can increase capacity but adds transfer costs, so use it only after measuring.", example: "The compute planner is a rough lower bound. Real jobs also need room for fragmentation, temporary buffers, and collectives." },
      { title: "Profile before optimizing", lesson: "torch.profiler identifies framework operations, Nsight Systems identifies whole-system stalls, and Nsight Compute identifies kernel behavior. MFU/HFU and cost-per-token metrics make throughput comparable across runs.", example: "A custom Triton kernel is justified only when the trace shows a stable, bandwidth-bound hot path worth maintaining." },
      { title: "Read and reproduce claims critically", lesson: "Start with abstract, figures, results, and baselines, then inspect methods. A clean ablation changes one thing at a time with matched budgets and uncertainty; open source should include code, weights, evaluation, environment, and a candid model card.", example: "A claimed improvement without a strong baseline, confidence interval, or compute comparison is a hypothesis to test—not a conclusion." },
    ],
    practice: ["Estimate model-state and activation memory for a planned run, then compare with measured peak memory.", "Use a profiler trace to choose one bottleneck and quantify an improvement.", "Write a three-row ablation table with a causal question for each row."],
  },
  "advanced-projects": {
    lead: "Advanced projects prove that a model can survive operations, not only a notebook. They require reliability, budgets, evaluation, security, deployment, and a written account of trade-offs.",
    units: [
      { title: "Production LLM platform", lesson: "A multi-tenant vLLM service must manage continuous batching, compatible APIs, budgets, rate limits, tracing, prompt-injection defenses, and uptime over time. A Helm chart or equivalent deployment artifact is part of the deliverable because repeatable operation is the point.", example: "A high tokens/sec number is incomplete without concurrency, prompt length, latency percentile, model, and quality settings." },
      { title: "Agent with evaluations", lesson: "A useful agent uses narrow tools with Pydantic-validated arguments, a golden test set, CI quality gates, traces, and autoscaling. Each tool should have least privilege and an observable failure path.", example: "A 50-case suite can include happy paths, malformed inputs, adversarial retrieved text, tool outages, and policy boundaries." },
      { title: "The completion checks are operating skills", lesson: "Choosing LoRA versus continued pretraining, profiling a bottleneck, detecting drift, patching injection, reproducing a paper, and recovering a multi-node job all require evidence. The goal is a documented decision, not an impressive-sounding tool list.", example: "A postmortem that names the failed metric, root cause, mitigation, and regression test is stronger evidence than a successful demo." },
    ],
    practice: ["Write an SLO and a seven-day soak-test plan for an LLM endpoint.", "Design a 50-case agent suite that includes at least ten adversarial cases.", "Run a failure-recovery drill and document what state was restored."],
  },
  interview: {
    lead: "Strong interviews sound like good engineering reviews: clarify the objective, state assumptions, choose an evaluation, identify failure modes, and make trade-offs explicit.",
    units: [
      { title: "Explain fundamentals with a decision", lesson: "Do not recite bias-variance or Adam definitions in isolation. Connect them to a learning curve, a data regime, a gradient behavior, or a choice of regularization and show how you would test the hypothesis.", example: "If validation loss rises while training loss falls, propose early stopping and a split audit before claiming the model needs more capacity." },
      { title: "Calculate, then design", lesson: "Attention complexity, KV-cache memory, parameter count, and tokenization are common calculations because they reveal system constraints. In system design, map data, features, training, serving, monitoring, rollout, and recovery in order.", example: "For search, separate candidate generation, ranking, reranking, metrics, feedback, and diversity constraints rather than calling it one model." },
      { title: "Practice evidence-based stories", lesson: "Prepare STAR stories about an ambiguity, a failure, and a shipped outcome. For live paper critique, name the claim, data, baseline, threats to validity, and the single experiment that would most change your mind.", example: "A good behavioral answer gives scope, your decision, the measurable result, and what you learned—not just the tools used." },
    ],
    practice: ["Implement scaled dot-product attention from scratch and test shapes on a toy input.", "Solve one grouped time-series validation scenario aloud.", "Rehearse three STAR stories with a metric and a failure mode in each."],
  },
  "applied-llm": {
    lead: "Applied LLM engineering is about turning uncertain generation into bounded, observable product behavior. The core loop is evidence retrieval, structured action, evaluation, monitoring, and disciplined cost control.",
    units: [
      { title: "Build evidence-backed responses", lesson: "Hybrid retrieval, rerankers, citations, and structured output should each be tested. The model should say what evidence it used, and the application should reject answers or tool calls that do not meet the schema and policy.", example: "Citations are not decorations: verify they support the exact claim placed next to them." },
      { title: "Make tools narrow and observable", lesson: "MCP, LangGraph, Semantic Kernel, and related frameworks can organize state and tools, but application-level permissions remain the security boundary. Use validation, tracing, rate limits, and replayable failures.", example: "A calendar tool should accept a typed event request, verify the user, and record the operation—not execute arbitrary natural language." },
      { title: "Optimize after measuring", lesson: "Caching, routing, batching, distillation, and model selection trade cost, latency, and quality. Measure by task slice, not only a blended average, so savings do not silently remove the behavior your users need.", example: "Route simple extraction to a smaller model only after a golden set shows its schema and accuracy are sufficient." },
    ],
    practice: ["Create a cited-answer evaluator that checks both schema and supporting evidence.", "Add one typed MCP-style tool with audit logging.", "Compare a small and large model on quality, p95 latency, and cost for the same task."],
  },
  "research-foundation": {
    lead: "Foundation-model work joins systems engineering, data curation, and scientific method. The standard is reproducible evidence: a result should survive a smaller budget, a different seed, and another person’s implementation.",
    units: [
      { title: "Study readable training systems", lesson: "nanoGPT, LitGPT, and Levanter expose different levels of abstraction around tokenization, data loading, optimization, parallelism, and checkpoints. Read them to connect equations with a real training loop, not to copy a recipe blindly.", example: "Trace how a batch becomes logits, loss, gradients, optimizer updates, and a saved checkpoint in one codebase." },
      { title: "Treat data as the model’s curriculum", lesson: "Pretraining quality depends on curation, deduplication, contamination checks, domain balance, licensing, and documentation. Scaling laws help allocate a budget, but only within the regime and assumptions actually measured.", example: "A benchmark answer appearing in the training corpus invalidates a headline evaluation score regardless of parameter count." },
      { title: "Publish a reproducible result", lesson: "Long-context methods, distillation, compression, and custom kernels should include matched baselines, accuracy slices, throughput, memory, cost, and limitations. A Hub release needs immutable revisions and enough code/configuration to recreate the artifact.", example: "A faster kernel without a numerical-tolerance test or benchmark script is not a reliable contribution." },
    ],
    practice: ["Reproduce a small result from a paper and write down every deviation.", "Run a near-duplicate search across train and benchmark text.", "Publish a minimal model card with data provenance, environment, metrics, limitations, and license."],
  },
  "cv-platform": {
    lead: "Computer-vision and MLOps specializations meet at the same requirement: a model must move from labeled data to a reliable deployment with measured quality, cost, and failure modes.",
    units: [
      { title: "Match visual tasks to annotations", lesson: "Detection, segmentation, OCR, VLMs, diffusion, video, 3D, and edge inference all need different labels and metrics. Evaluate the actual target: boxes, masks, text, grounded answers, temporal actions, render quality, or on-device latency.", example: "A document model should be tested on layout, tables, formula fidelity, and cited source regions—not only character accuracy." },
      { title: "Build a platform that preserves lineage", lesson: "Kubernetes, KServe, Kubeflow, Ray, feature stores, DVC/LakeFS, CI/CD, and registries are useful when they reduce repeated work across teams. Their value is reproducible jobs, controlled rollout, and observable resource use—not complexity for its own sake.", example: "A training job should consume an immutable data version and register the resulting model with its configuration and evaluation." },
      { title: "Operate GPUs like a budget", lesson: "Autoscaling, spot instances, reservations, MIG partitioning, and canaries can reduce cost, but need queue, utilization, latency, and quality signals. Drift monitoring must lead to an owned response rather than an unattended dashboard.", example: "A cheap spot training run is a poor choice if the checkpoint/restart strategy loses more time than it saves." },
    ],
    practice: ["Define metrics and error taxonomy for one detection or OCR task.", "Sketch a data-version-to-canary-deployment pipeline with rollback.", "Compare on-device latency and quality for a quantized and non-quantized model."],
  },
  "data-centric": {
    lead: "Data-centric AI improves the examples, labels, and documentation that make learning possible. It is often the highest-leverage place to invest when a model has already reached the limits of noisy or unrepresentative data.",
    units: [
      { title: "Audit labels before scaling models", lesson: "Cleanlab and targeted review can surface suspicious labels, but the goal is prioritization for domain experts—not blind deletion. Track which issues are label errors, ambiguous cases, missing classes, or policy disagreements.", example: "A model can appear inconsistent when the same input pattern has two legitimate but undocumented labels." },
      { title: "Spend annotation budget where it changes decisions", lesson: "Active learning chooses uncertain, diverse, or high-impact examples; weak supervision combines noisy rules; synthetic data can fill gaps. Each needs an evaluation that checks whether it adds real coverage rather than duplicate artifacts.", example: "Generate rare support cases only after checking that they do not copy training examples or teach the model a fabricated policy." },
      { title: "Document limits honestly", lesson: "Datasheets and model cards record collection, consent, composition, transformations, intended use, gaps, and risks. They turn hidden assumptions into reviewable engineering constraints.", example: "A model card should say which languages, devices, groups, and edge cases were not evaluated." },
    ],
    practice: ["Sample and review the 20 most suspicious labels from a classifier.", "Design one active-learning round with a labeling budget and an expected metric.", "Write a short datasheet for a dataset you already use."],
  },
  resources: {
    lead: "Resources are useful when they answer the next concrete question in a build. Use official documentation for APIs, courses for a structured ramp, books for durable concepts, and papers or leaderboards to inspect evidence—not as an endless reading queue.",
    units: [
      { title: "Use primary documentation while implementing", lesson: "PyTorch, Transformers, TRL, PEFT, vLLM, RAGAS, and lm-evaluation-harness documentation is the source for current APIs and behavior. Read the smallest relevant page, build a minimal example, and save a working reference in your project notes.", example: "When a trainer argument changes, the versioned documentation and your lockfile are more reliable than a copied tutorial." },
      { title: "Use courses and books to connect concepts", lesson: "fast.ai, CS231n, CS224n, Hugging Face Learn, Karpathy’s series, Raschka’s book, Chip Huyen’s systems text, and Goodfellow’s Deep Learning each serve different learning styles. Pair a chapter or lecture with a small implementation.", example: "After learning attention from CS224n, implement a toy attention module and inspect its weights." },
      { title: "Use research feeds critically", lesson: "Papers with Code and Daily Papers are discovery tools. Before adopting a result, read the primary paper, inspect the evaluation, check code and license, and ask whether the benchmark resembles your task.", example: "A leaderboard result without a reproducible configuration is a lead to investigate, not an engineering decision." },
    ],
    practice: ["Create a personal reference index with one official source and one runnable example per tool you use.", "Choose one course lesson and pair it with a two-hour coding exercise.", "Review one trending paper using claim, evidence, baseline, compute, and reproducibility as headings."],
  },
};

const TOPIC_DEEP_DIVES = {
  "CNN building blocks (conv, pool, batchnorm, residual)": {
    core: "A convolutional network is built from a small number of ideas that are reused many times. Convolutions look for local patterns with shared filters, pooling or striding changes spatial resolution, normalization stabilizes the distribution seen by later layers, and residual paths preserve an easy route for information and gradients.",
    mechanics: "A 3×3 convolution slides the same nine weights over every image location, producing a feature map. Early filters often respond to edges and texture; later layers combine those responses into shapes and objects. A residual block computes F(x) and returns x + F(x), so the network can learn a small correction instead of having to relearn the identity mapping.",
    example: "For a 32×32 image, a stack might use a 3×3 convolution, normalization, ReLU, then stride 2 to reach 16×16. A skip connection lets the original 16×16 representation bypass two convolutions; if the new layers are not useful yet, the block can behave close to an identity function.",
    pitfall: "Do not assume pooling is always beneficial. Aggressive downsampling can discard the small object or thin defect that your application needs to detect. Check intermediate feature-map resolution against the smallest meaningful structure in the data.",
    practice: "Build one residual block in PyTorch, print the tensor shapes after every operation, and compare a shallow plain CNN with a residual version on the same small dataset.",
  },
  "ResNet, EfficientNet, ConvNeXt": {
    core: "These are three design philosophies for strong visual backbones. ResNet made very deep networks practical with skip connections. EfficientNet scales depth, width, and input resolution together. ConvNeXt modernizes convolutions using training and architectural choices learned from transformer-era vision models.",
    mechanics: "ResNet asks each block to learn a residual correction. EfficientNet starts with a baseline and scales several dimensions with a constrained multiplier instead of making one dimension huge. ConvNeXt keeps convolution but uses larger kernels, inverted bottlenecks, layer normalization, and updated training recipes.",
    example: "If you have limited labeled images, start with a pretrained ResNet or ConvNeXt and fine-tune a classification head. If latency and input resolution are fixed, benchmark candidate EfficientNet variants instead of assuming the largest model is best.",
    pitfall: "Comparing backbone names without controlling preprocessing, augmentation, input size, and pretrained weights produces misleading conclusions. A weaker backbone with the correct data pipeline can outperform a larger one trained poorly.",
    practice: "Fine-tune two pretrained backbones with identical splits, augmentations, epochs, and metric reporting. Record accuracy, calibration, inference latency, parameter count, and failure examples.",
  },
  "RNN, LSTM, GRU and their limits": {
    core: "Recurrent models process a sequence one step at a time while carrying a hidden state. LSTMs and GRUs add gates that decide what to remember, forget, and expose, which helps them retain information longer than a basic RNN.",
    mechanics: "A vanilla RNN repeatedly updates hₜ = f(Wxₜ + Uhₜ₋₁). Repeated multiplication can shrink or explode gradients across long sequences. LSTM cells use separate input, forget, and output gates around a memory cell; GRUs offer a simpler gated alternative.",
    example: "For a short sensor sequence, a GRU can summarize prior readings before predicting the next state. For a long document, however, the sequential recurrence prevents full parallel training and can struggle to connect distant facts.",
    pitfall: "A gate does not solve every long-context problem. If a model must compare tokens thousands of positions apart, inspect whether recurrence has the required memory and whether a transformer or retrieval system better matches the task.",
    practice: "Train a small RNN and GRU on the same sequence task. Plot validation loss as sequence length grows and explain where each model begins to fail.",
  },
  "Transformer encoder, decoder, encoder-decoder": {
    core: "Transformer families differ in which tokens can attend to which other tokens. An encoder builds contextual representations from an entire input. A decoder generates left-to-right, seeing only earlier tokens. An encoder-decoder model reads a source sequence and generates a target sequence while attending back to the encoded source.",
    mechanics: "Encoder attention is usually bidirectional, so every input token can use context on both sides. Decoder self-attention uses a causal mask so position t cannot see future positions. Encoder-decoder models add cross-attention: decoder queries attend to encoder keys and values, which lets each generated token focus on relevant source content.",
    example: "Document classification is naturally encoder-style: read the whole document and classify it. Next-token chat generation is decoder-style. Translation is encoder-decoder: encode the source sentence, then generate the target sentence one token at a time while cross-attending to the source.",
    pitfall: "Do not choose a decoder merely because it is popular. If the task needs a fixed embedding, pair scoring, token labels, or bidirectional context without generation, an encoder model is often simpler, faster, and easier to evaluate.",
    practice: "For classification, translation, and chat completion, identify the attention masks, model family, input/output tensors, loss, and evaluation metric you would use before writing code.",
  },
  "Self-attention, multi-head attention, KV cache": {
    core: "Self-attention lets each token decide which other tokens matter for its representation. Multi-head attention runs several attention patterns in parallel. During autoregressive generation, the KV cache stores previously computed keys and values so the model does not reprocess the whole prompt for every new token.",
    mechanics: "Each token becomes a query Q, key K, and value V. Similarity scores QKᵀ determine how strongly each query mixes the values: softmax(QKᵀ/√d)V. Heads use different learned projections, then their outputs are combined. The cache grows with layers, tokens, heads, head dimension, batch size, and precision.",
    formula: "Attention(Q,K,V) = softmax(QKᵀ / √d)V",
    example: "When generating the 101st token after a 100-token prompt, caching means the model computes Q, K, and V only for the new token and reuses the first 100 K/V pairs. Without the cache it would recompute all 100 positions again.",
    pitfall: "Attention weights are not automatically explanations. They show one internal routing pattern, but a high weight does not prove causal importance. Use ablations or controlled tests before making interpretability claims.",
    practice: "Implement scaled dot-product attention for a four-token toy sequence. Print the attention matrix, change one token, and explain which rows and outputs change.",
  },
  "Positional encodings: sinusoidal, learned, RoPE, ALiBi": {
    core: "Attention alone is permutation-invariant: without position information, the sequences “dog bites man” and “man bites dog” look like the same bag of tokens. Positional methods inject order in different ways and strongly affect whether a model can handle contexts longer than its training range.",
    mechanics: "Sinusoidal encodings add deterministic waves of several frequencies to token embeddings. Learned embeddings add trainable position vectors but may not extrapolate beyond their trained length. RoPE rotates query and key pairs by a position-dependent angle, making relative distance appear naturally in the dot product. ALiBi adds a distance-dependent bias directly to attention scores.",
    example: "A model trained with learned positions up to 2,048 tokens has no learned vector for position 2,049 unless it is extended. RoPE scaling and ALiBi offer different strategies for handling longer context, but both require measurement rather than assumption.",
    pitfall: "Long-context support is not just a configuration number. Test retrieval, reasoning, perplexity, latency, and memory at the lengths your application needs; a model can accept 32k tokens while failing to use distant evidence.",
    practice: "Plot sinusoidal position vectors for several positions, then compare how a learned-table, RoPE, and ALiBi model would handle an input beyond its training length.",
  },
  "Vision Transformers (ViT, Swin)": {
    core: "Vision Transformers convert an image into a sequence of patches and apply transformer blocks to those patch tokens. ViT uses global attention across patches. Swin uses local windows that shift between layers, giving a hierarchical representation with lower cost for large images.",
    mechanics: "An image is divided into fixed-size patches; each flattened patch is projected into an embedding and given positional information. ViT can compare any patch with any other patch in a layer, but that cost grows quickly with image resolution. Swin restricts attention to windows and shifts the window partition in later blocks so information can cross boundaries.",
    example: "For high-resolution microscopy, a ViT may capture global morphology but require substantial memory. A windowed model can retain more local detail at the same budget, though it may need enough stages to connect distant regions.",
    pitfall: "Patch size is a scientific decision. If a patch is larger than the defect or feature of interest, the first representation may already have lost the signal. Match resolution, patch size, and augmentation to the smallest meaningful structure.",
    practice: "Calculate the number of tokens produced by a 224×224 image with 16×16 patches, then repeat for 8×8 patches and discuss the attention-cost change.",
  },
  "Diffusion model basics (DDPM, DDIM)": {
    core: "Diffusion models learn to turn noise into data. During training, known noise is added to a real example at many noise levels; the network learns to predict or remove that noise. Sampling starts from random noise and repeatedly applies the learned denoising direction.",
    mechanics: "A DDPM uses a stochastic reverse process with many small denoising steps. DDIM uses a related non-Markovian formulation that can follow a more deterministic path and often sample in fewer steps. The conditioning signal—text, class, image, or control input—guides the denoiser at every step.",
    example: "To generate an image from text, the model begins with a random latent and repeatedly removes noise while conditioning on the text embedding. Fewer sampling steps are faster but can reduce fidelity or diversity, so evaluate the trade-off on the intended task.",
    pitfall: "A visually compelling sample is not proof of a useful model. Check prompt adherence, diversity, memorization, bias, safety, provenance, and downstream task performance—especially when fine-tuning on a small private dataset.",
    practice: "Write the forward noising and reverse denoising loops in pseudocode. Then compare output quality and latency at three DDIM step counts on the same prompts.",
  },
  "Mixture-of-Experts (MoE) intuition": {
    core: "A Mixture-of-Experts layer replaces one dense feed-forward network with many expert networks and a router. For each token, the router activates only a small number of experts, so the model can have much larger total parameter capacity without running every parameter for every token.",
    mechanics: "The router scores experts for each token, chooses top-k experts, sends tokens to those experts, and combines their outputs. Training adds a load-balancing objective so a few popular experts do not receive all traffic. Serving must handle token routing, communication, and uneven expert load efficiently.",
    example: "In a top-2 MoE with eight experts, each token may use only two FFN blocks. A multilingual or code-heavy batch may route disproportionately to particular experts, which can create a throughput bottleneck even though total FLOPs look low.",
    pitfall: "Sparse activation does not mean simple serving. Poor load balance, capacity limits, token drops, and cross-device routing can erase theoretical speed gains. Always measure expert utilization and tail latency by workload slice.",
    practice: "Simulate routing 100 tokens across eight experts, calculate expert load, and compare a balanced versus collapsed routing distribution.",
  },
};

function fallbackTopicLesson(topic, section, index) {
  const guide = SECTION_GUIDES[section.id];
  const unit = guide?.units[index % guide.units.length];
  return {
    core: topic.explanation,
    mechanics: unit?.lesson || "Identify the data representation, objective, constraints, and evaluation signal before adopting an implementation.",
    example: unit?.example || "Build the smallest isolated example first, record its input and output, then compare it against a simple baseline.",
    pitfall: "Do not treat a library name or aggregate metric as evidence. Fix the split, baseline, measurement, and failure slices before increasing system complexity.",
    practice: `Create a minimal experiment for “${topic.title}”, state the success metric in advance, and write down one failure mode you expect to inspect.`,
  };
}

// Audit anchors: 28 navigable sections and 343 named topic explanations.

function AnalogyBox({ children }) {
  return (
    <div style={ANALOGY.box}>
      <div style={ANALOGY.title}>Simple analogy</div>
      <div style={ANALOGY.body}>{children}</div>
    </div>
  );
}

function SectionTitle({ children }) {
  return <div style={{ fontSize: FONT.xl, fontWeight: 800, color: T.accent, marginBottom: 12 }}>{children}</div>;
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "7px 8px",
  borderRadius: LAYOUT.radiusMd,
  border: `1px solid ${T.border}`,
  background: T.panel,
  color: T.ink,
  fontFamily: "inherit",
  fontSize: FONT.base,
};

function ProgressBar({ value, max, label }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: FONT.sm, color: T.muted, marginBottom: 4 }}>
        <span>{label}</span>
        <span>{value}/{max} · {pct}%</span>
      </div>
      <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} style={{ height: 7, borderRadius: LAYOUT.radiusSm, overflow: "hidden", background: T.border }}>
        <div style={{ width: `${pct}%`, height: "100%", background: T.accent, transition: "width 0.2s ease" }} />
      </div>
    </div>
  );
}

function GuidedLesson({ section }) {
  const guide = SECTION_GUIDES[section.id];
  if (!guide) return null;

  return (
    <div style={{ ...LAYOUT.section, marginBottom: 18 }}>
      <div style={{ ...PANEL.base, borderLeft: `4px solid ${T.accent}`, lineHeight: 1.8, fontSize: FONT.base }}>
        <div style={{ fontSize: FONT.lg, fontWeight: 800, color: T.accent, marginBottom: 6 }}>Core lesson</div>
        {guide.lead}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
        {guide.units.map((unit) => (
          <article key={unit.title} style={{ ...PANEL.base, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: FONT.lg, fontWeight: 800, color: T.ink }}>{unit.title}</div>
            <div style={{ fontSize: FONT.base, color: T.ink, lineHeight: 1.75 }}>{unit.lesson}</div>
            {unit.formula && (
              <div style={{ fontFamily: "Georgia, serif", fontSize: FONT.md, color: T.accent, background: T.accent + "0d", border: `1px solid ${T.accent}33`, borderRadius: LAYOUT.radiusMd, padding: "7px 9px", textAlign: "center" }}>{unit.formula}</div>
            )}
            <div style={{ fontSize: FONT.sm, color: T.muted, lineHeight: 1.65 }}><strong style={{ color: T.ink }}>Worked use case.</strong> {unit.example}</div>
          </article>
        ))}
      </div>

      <div style={{ ...PANEL.base, background: T.accent + "08" }}>
        <div style={{ fontSize: FONT.lg, fontWeight: 800, color: T.accent, marginBottom: 7 }}>Practice before moving on</div>
        <ol style={{ margin: 0, paddingLeft: 22, display: "flex", flexDirection: "column", gap: 5, color: T.ink, fontSize: FONT.base, lineHeight: 1.7 }}>
          {guide.practice.map((task) => <li key={task}>{task}</li>)}
        </ol>
      </div>
    </div>
  );
}

function TopicLesson({ topic, section, index }) {
  const lesson = TOPIC_DEEP_DIVES[topic.title] || fallbackTopicLesson(topic, section, index);
  const panels = [
    ["What it is", lesson.core],
    ["How it works", lesson.mechanics],
    ["Worked reasoning", lesson.example],
    ["Common mistake", lesson.pitfall],
  ];

  return (
    <div style={{ padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 8 }}>
        {panels.map(([label, body]) => (
          <div key={label} style={{ ...PANEL.base, background: label === "Common mistake" ? T.surface : T.panel }}>
            <div style={{ fontSize: FONT.sm, fontWeight: 800, color: T.accent, marginBottom: 5 }}>{label}</div>
            <div style={{ fontSize: FONT.base, color: T.ink, lineHeight: 1.75 }}>{body}</div>
          </div>
        ))}
      </div>
      <div style={{ ...PANEL.base, borderLeft: `4px solid ${T.accent}`, background: T.accent + "08" }}>
        <div style={{ fontSize: FONT.sm, fontWeight: 800, color: T.accent, marginBottom: 5 }}>Practice task</div>
        <div style={{ fontSize: FONT.base, color: T.ink, lineHeight: 1.75 }}>{lesson.practice}</div>
      </div>
    </div>
  );
}

function StageOverview({ completed }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 8, marginBottom: 14 }}>
      {BLOCKS.filter((block) => block.id !== "overview").map((block) => {
        const stageTopics = CURRICULUM.filter((topic) => topic.block === block.id);
        const done = stageTopics.filter((topic) => completed.has(topic.id)).length;
        return (
          <div key={block.id} style={PANEL.base}>
            <div style={PANEL.title}>{block.label}</div>
            <div style={{ ...PANEL.smallText, color: T.muted }}>{block.hours}</div>
            <ProgressBar value={done} max={stageTopics.length} label={`${block.label} progress`} />
          </div>
        );
      })}
    </div>
  );
}

function TopicExplorer({ section, completed, openTopics, onToggleOpen, onToggleComplete }) {
  const [showCoverageMap, setShowCoverageMap] = useState(false);
  const done = section.topics.filter((topic) => completed.has(topic.id)).length;
  const allOpen = section.topics.every((topic) => openTopics.has(topic.id));
  return (
    <div style={LAYOUT.section}>
      <div style={PANEL.base}>
        <ProgressBar value={done} max={section.topics.length} label="Section completion" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          <button type="button" onClick={() => setShowCoverageMap((value) => !value)} style={BUTTON.toggle(showCoverageMap)}>
            {showCoverageMap ? "Hide complete topic map" : `Open complete topic map (${section.topics.length} topics)`}
          </button>
          <button type="button" onClick={() => onToggleOpen(section.topics.map((topic) => topic.id), !allOpen)} style={BUTTON.toggle(allOpen)}>
            {allOpen ? "Collapse all mini-lessons" : "Expand all mini-lessons"}
          </button>
        </div>
      </div>
      {!showCoverageMap && (
        <div style={{ ...PANEL.base, fontSize: FONT.base, lineHeight: 1.75, color: T.muted }}>
          The guided lesson above is the teaching path. Open the complete topic map when you want to review every item from the roadmap, mark progress, or search for a specific tool.
        </div>
      )}
      {showCoverageMap && <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {section.topics.map((topic, index) => {
          const isOpen = openTopics.has(topic.id);
          const isDone = completed.has(topic.id);
          const detailId = `${topic.id}-detail`;
          return (
            <div key={topic.id} style={{ background: T.panel, border: `1px solid ${isDone ? T.accent + "66" : T.border}`, borderLeft: `4px solid ${isDone ? T.accent : T.border}`, borderRadius: LAYOUT.radiusLg, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "stretch" }}>
                <button type="button" aria-expanded={isOpen} aria-controls={detailId} onClick={() => onToggleOpen([topic.id])} style={{ flex: 1, border: 0, background: "transparent", color: T.ink, textAlign: "left", padding: "10px 12px", cursor: "pointer", fontFamily: "inherit", fontSize: FONT.base, fontWeight: 700, lineHeight: 1.5 }}>
                  <span style={{ color: T.muted, marginRight: 8 }}>{index + 1}.</span>{topic.title}
                </button>
                <button type="button" aria-pressed={isDone} onClick={() => onToggleComplete(topic.id)} style={{ ...BUTTON.toggle(isDone), margin: 7, minWidth: 76 }}>
                  {isDone ? "Completed" : "Mark done"}
                </button>
              </div>
              {isOpen && <div id={detailId}><TopicLesson topic={topic} section={section} index={index} /></div>}
            </div>
          );
        })}
      </div>}
    </div>
  );
}

function NumberField({ label, value, onChange, min = 0, max, step = 1 }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: FONT.sm, color: T.muted }}>
      <span>{label}</span>
      <input type="number" value={value} min={min} max={max} step={step} onChange={(event) => {
        const next = Number(event.target.value);
        if (Number.isFinite(next)) onChange(Math.max(min, max == null ? next : Math.min(max, next)));
      }} style={inputStyle} />
    </label>
  );
}

function ResultTile({ label, value, note }) {
  return (
    <div style={{ ...PANEL.base, textAlign: "center" }}>
      <div style={{ fontSize: FONT.sm, color: T.muted, marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: FONT.xl, color: T.accent, fontWeight: 800 }}>{value}</div>
      {note && <div style={{ fontSize: FONT.xs, color: T.muted, marginTop: 3 }}>{note}</div>}
    </div>
  );
}

function MetricLab() {
  const [tp, setTp] = useState(42);
  const [fp, setFp] = useState(8);
  const [fn, setFn] = useState(18);
  const [tn, setTn] = useState(132);
  const [goal, setGoal] = useState("balanced");
  const safeDivide = (a, b) => (b === 0 ? 0 : a / b);
  const accuracy = safeDivide(tp + tn, tp + tn + fp + fn);
  const precision = safeDivide(tp, tp + fp);
  const recall = safeDivide(tp, tp + fn);
  const f1 = safeDivide(2 * precision * recall, precision + recall);
  const specificity = safeDivide(tn, tn + fp);
  const format = (value) => `${(value * 100).toFixed(1)}%`;
  const recommendation = {
    balanced: "Use F1 when precision and recall both matter; inspect the confusion matrix and per-class slices.",
    catch: "Prioritize recall and tune the threshold against the cost of missed positives.",
    alerts: "Prioritize precision and calibration so scarce review capacity is not flooded with false alerts.",
    ranking: "Use PR-AUC for rare positives or ROC-AUC for broad ranking, then select an operating threshold separately.",
    overall: "Accuracy is acceptable only when classes and error costs are reasonably balanced.",
  }[goal];

  return (
    <div style={LAYOUT.section}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8 }}>
        <NumberField label="True positives" value={tp} onChange={setTp} />
        <NumberField label="False positives" value={fp} onChange={setFp} />
        <NumberField label="False negatives" value={fn} onChange={setFn} />
        <NumberField label="True negatives" value={tn} onChange={setTn} />
      </div>
      <div style={{ overflowX: "auto" }}>
        <table aria-label="Confusion matrix" style={{ width: "100%", borderCollapse: "collapse", minWidth: 420, fontSize: FONT.base }}>
          <thead>
            <tr>
              <th style={{ padding: 7, color: T.muted, fontWeight: 600 }} />
              <th scope="col" style={{ padding: 7, color: T.muted, fontWeight: 600 }}>Predicted positive</th>
              <th scope="col" style={{ padding: 7, color: T.muted, fontWeight: 600 }}>Predicted negative</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" style={{ padding: 7, color: T.muted, fontWeight: 600 }}>Actual positive</th>
              <td style={{ ...PANEL.base, textAlign: "center", color: T.accent, fontWeight: 800 }}>TP {tp}</td>
              <td style={{ ...PANEL.base, textAlign: "center", fontWeight: 700 }}>FN {fn}</td>
            </tr>
            <tr>
              <th scope="row" style={{ padding: 7, color: T.muted, fontWeight: 600 }}>Actual negative</th>
              <td style={{ ...PANEL.base, textAlign: "center", fontWeight: 700 }}>FP {fp}</td>
              <td style={{ ...PANEL.base, textAlign: "center", color: T.accent, fontWeight: 800 }}>TN {tn}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
        <ResultTile label="Accuracy" value={format(accuracy)} note="All correct / all cases" />
        <ResultTile label="Precision" value={format(precision)} note="TP / predicted positive" />
        <ResultTile label="Recall" value={format(recall)} note="TP / actual positive" />
        <ResultTile label="F1" value={format(f1)} note="Harmonic P/R mean" />
        <ResultTile label="Specificity" value={format(specificity)} note="TN / actual negative" />
      </div>
      <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: FONT.sm, color: T.muted }}>
        <span>What matters most?</span>
        <select value={goal} onChange={(event) => setGoal(event.target.value)} style={inputStyle}>
          <option value="balanced">Balance false positives and false negatives</option>
          <option value="catch">Catch as many positives as possible</option>
          <option value="alerts">Keep positive alerts trustworthy</option>
          <option value="ranking">Rank examples before choosing a threshold</option>
          <option value="overall">Overall correctness on balanced classes</option>
        </select>
      </label>
      <div style={{ ...PANEL.base, borderLeft: `4px solid ${T.accent}`, lineHeight: 1.7, fontSize: FONT.base }}>
        <strong style={{ color: T.accent }}>Metric recommendation.</strong> {recommendation}
      </div>
    </div>
  );
}

function ComputeLab() {
  const [gpus, setGpus] = useState(4);
  const [microbatch, setMicrobatch] = useState(2);
  const [accumulation, setAccumulation] = useState(8);
  const [params, setParams] = useState(7);
  const [gpuMemory, setGpuMemory] = useState(80);
  const [sequence, setSequence] = useState(4096);
  const [hidden, setHidden] = useState(4096);
  const [layers, setLayers] = useState(32);
  const [precision, setPrecision] = useState("bf16");
  const [strategy, setStrategy] = useState("fsdp");
  const [checkpointing, setCheckpointing] = useState(true);
  const bytes = precision === "fp32" ? 4 : 2;
  const effectiveBatch = Math.max(1, gpus) * microbatch * accumulation;
  const weights = params * bytes;
  const grads = params * bytes;
  const optimizer = params * 8;
  const shard = strategy === "fsdp" || strategy === "zero3" ? Math.max(1, gpus) : 1;
  const persistent = (weights + grads + optimizer) / shard;
  const activationFactor = checkpointing ? 2.8 : 8;
  const activations = microbatch * sequence * hidden * layers * bytes * activationFactor / 1e9;
  const estimate = persistent + activations + 2;
  const headroom = gpuMemory - estimate;

  return (
    <div style={LAYOUT.section}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))", gap: 8 }}>
        <NumberField label="GPUs / data workers" value={gpus} onChange={setGpus} min={1} max={1024} />
        <NumberField label="Microbatch / GPU" value={microbatch} onChange={setMicrobatch} min={1} max={1024} />
        <NumberField label="Accumulation steps" value={accumulation} onChange={setAccumulation} min={1} max={1024} />
        <NumberField label="Parameters (billions)" value={params} onChange={setParams} min={0.1} max={1000} step={0.1} />
        <NumberField label="GPU memory (GB)" value={gpuMemory} onChange={setGpuMemory} min={4} max={512} />
        <NumberField label="Sequence length" value={sequence} onChange={setSequence} min={128} max={1000000} />
        <NumberField label="Hidden size" value={hidden} onChange={setHidden} min={128} max={65536} />
        <NumberField label="Layers" value={layers} onChange={setLayers} min={1} max={512} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {["bf16", "fp16", "fp32"].map((item) => <button key={item} type="button" onClick={() => setPrecision(item)} style={BUTTON.toggle(precision === item)}>{item}</button>)}
        {["ddp", "fsdp", "zero3"].map((item) => <button key={item} type="button" onClick={() => setStrategy(item)} style={BUTTON.toggle(strategy === item)}>{item}</button>)}
        <button type="button" onClick={() => setCheckpointing((value) => !value)} style={BUTTON.toggle(checkpointing)}>{checkpointing ? "Checkpointing on" : "Checkpointing off"}</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8 }}>
        <ResultTile label="Effective batch" value={effectiveBatch.toLocaleString()} note="micro × accumulation × workers" />
        <ResultTile label="Model state / GPU" value={`${persistent.toFixed(1)} GB`} note={`${strategy} estimate`} />
        <ResultTile label="Activations / GPU" value={`${activations.toFixed(1)} GB`} note="shape-dependent rough estimate" />
        <ResultTile label="Total / GPU" value={`${estimate.toFixed(1)} GB`} note="includes 2 GB buffer" />
      </div>
      <div style={{ ...PANEL.base, borderLeft: `4px solid ${headroom >= gpuMemory * 0.1 ? T.accent : T.ink}`, fontSize: FONT.base, lineHeight: 1.7 }}>
        <strong>{headroom >= 0 ? `${headroom.toFixed(1)} GB estimated headroom.` : `${Math.abs(headroom).toFixed(1)} GB over capacity.`}</strong>{" "}
        This teaching estimate omits framework, fragmentation, temporary collective, and some optimizer buffers; keep at least 10–20% measured headroom and verify with a short profiler run.
      </div>
    </div>
  );
}

function ApproachLab() {
  const [freshness, setFreshness] = useState("stable");
  const [privateKnowledge, setPrivateKnowledge] = useState(true);
  const [citations, setCitations] = useState(true);
  const [behaviorChange, setBehaviorChange] = useState(false);
  const [examples, setExamples] = useState(100);
  const scores = [
    { name: "Prompt", score: 3 + (freshness === "stable" ? 1 : 0) + (examples < 200 ? 1 : 0) - (privateKnowledge ? 1 : 0) - (citations ? 1 : 0) },
    { name: "RAG", score: 2 + (freshness === "changing" ? 3 : 0) + (privateKnowledge ? 3 : 0) + (citations ? 2 : 0) },
    { name: "Fine-tune", score: 1 + (behaviorChange ? 4 : 0) + (examples >= 1000 ? 3 : examples >= 200 ? 1 : -1) + (freshness === "stable" ? 1 : 0) },
  ].sort((a, b) => b.score - a.score);
  const winner = scores[0];
  const rationale = winner.name === "RAG"
    ? "Retrieve evidence at request time, preserve provenance, and evaluate retrieval separately from answer generation."
    : winner.name === "Fine-tune"
      ? "Use held-out examples to verify a repeatable behavior change, then check broad capabilities for forgetting."
      : "Start with a versioned prompt and a golden evaluation set; add system complexity only when measured gaps justify it.";

  return (
    <div style={LAYOUT.section}>
      <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: FONT.sm, color: T.muted }}>
        <span>How often does the knowledge change?</span>
        <select value={freshness} onChange={(event) => setFreshness(event.target.value)} style={inputStyle}>
          <option value="stable">Mostly stable</option>
          <option value="changing">Changes frequently</option>
        </select>
      </label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <button type="button" onClick={() => setPrivateKnowledge((value) => !value)} style={BUTTON.toggle(privateKnowledge)}>Private documents: {privateKnowledge ? "yes" : "no"}</button>
        <button type="button" onClick={() => setCitations((value) => !value)} style={BUTTON.toggle(citations)}>Citations required: {citations ? "yes" : "no"}</button>
        <button type="button" onClick={() => setBehaviorChange((value) => !value)} style={BUTTON.toggle(behaviorChange)}>Repeated behavior change: {behaviorChange ? "yes" : "no"}</button>
      </div>
      <NumberField label="High-quality labeled examples" value={examples} onChange={setExamples} min={0} max={10000000} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
        {scores.map((item, index) => <ResultTile key={item.name} label={index === 0 ? "Recommended first" : "Alternative"} value={item.name} note={`fit score ${item.score}`} />)}
      </div>
      <div style={{ ...PANEL.base, borderLeft: `4px solid ${T.accent}`, fontSize: FONT.base, lineHeight: 1.7 }}>
        <strong style={{ color: T.accent }}>{winner.name} first.</strong> {rationale} Hybrid systems are common: use prompting for instructions, RAG for evidence, and fine-tuning for durable behavior only after each layer earns its complexity.
      </div>
    </div>
  );
}

function DecisionLabs({ section, completed, onToggleComplete }) {
  const [activeLab, setActiveLab] = useState(0);
  const labs = [
    { label: "Metric lab", Component: MetricLab },
    { label: "Compute planner", Component: ComputeLab },
    { label: "Approach chooser", Component: ApproachLab },
  ];
  const { Component } = labs[activeLab];
  const topic = section.topics[activeLab];
  const isDone = completed.has(topic.id);
  return (
    <div style={LAYOUT.section}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }} role="tablist" aria-label="Roadmap decision labs">
        {labs.map((lab, index) => (
          <button key={lab.label} type="button" role="tab" aria-selected={activeLab === index} onClick={() => setActiveLab(index)} style={BUTTON.toggle(activeLab === index)}>{lab.label}</button>
        ))}
      </div>
      <div role="tabpanel" style={{ ...PANEL.base, padding: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div>
            <div style={PANEL.title}>{topic.title}</div>
            <div style={{ ...PANEL.smallText, color: T.muted }}>{topic.explanation}</div>
          </div>
          <button type="button" aria-pressed={isDone} onClick={() => onToggleComplete(topic.id)} style={BUTTON.toggle(isDone)}>{isDone ? "Completed" : "Mark done"}</button>
        </div>
        <Component />
      </div>
    </div>
  );
}

export default function AIMLRoadmap() {
  const [activeBlock, setActiveBlock] = useState("overview");
  const [activeSection, setActiveSection] = useState("map");
  const [query, setQuery] = useState("");
  const [openTopics, setOpenTopics] = useState(() => new Set());
  const [completed, setCompleted] = useState(() => new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      setHydrated(true);
      return;
    }
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
      setCompleted(new Set(Array.isArray(saved) ? saved.filter((id) => typeof id === "string") : []));
    } catch {
      setCompleted(new Set());
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed].sort()));
    } catch {
      // Progress remains available for this session when device storage is unavailable.
    }
  }, [completed, hydrated]);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return CURRICULUM.filter((item) => `${item.title} ${item.explanation} ${item.sectionLabel}`.toLowerCase().includes(normalized));
  }, [query]);
  const blockSections = SECTIONS.filter((section) => section.block === activeBlock);
  const section = SECTIONS.find((item) => item.id === activeSection) || SECTIONS[0];
  const sectionIndex = SECTIONS.findIndex((item) => item.id === section.id);
  const completedCount = CURRICULUM.filter((topic) => completed.has(topic.id)).length;

  const chooseBlock = (blockId) => {
    setActiveBlock(blockId);
    const first = SECTIONS.find((item) => item.block === blockId);
    if (first) setActiveSection(first.id);
  };
  const visitTopic = (topic) => {
    setActiveBlock(topic.block);
    setActiveSection(topic.sectionId);
    setOpenTopics((current) => new Set([...current, topic.id]));
  };
  const toggleOpen = (ids, force) => {
    setOpenTopics((current) => {
      const next = new Set(current);
      ids.forEach((id) => {
        const shouldOpen = force == null ? !next.has(id) : force;
        if (shouldOpen) next.add(id); else next.delete(id);
      });
      return next;
    });
  };
  const toggleComplete = (id) => {
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const move = (offset) => {
    const next = SECTIONS[sectionIndex + offset];
    if (!next) return;
    setActiveSection(next.id);
    setActiveBlock(next.block);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.ink, fontFamily: "'IBM Plex Mono', 'JetBrains Mono', 'Fira Code', monospace", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: 6, padding: "8px 24px", overflowX: "auto", background: T.panel, borderBottom: `1px solid ${T.border}` }}>
        {BLOCKS.map((block) => (
          <button key={block.id} type="button" onClick={() => chooseBlock(block.id)} aria-pressed={activeBlock === block.id} style={BUTTON.toggle(activeBlock === block.id)}>
            {block.label} · {block.hours}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, padding: "6px 24px", overflowX: "auto", background: T.panel, borderBottom: `1px solid ${T.border}` }}>
        {blockSections.map((item) => (
          <button key={item.id} type="button" onClick={() => setActiveSection(item.id)} aria-pressed={section.id === item.id} style={BUTTON.toggle(section.id === item.id)}>{item.label}</button>
        ))}
      </div>

      <main style={{ width: "100%", boxSizing: "border-box", maxWidth: 1040, margin: "0 auto", padding: "20px 24px", flex: 1 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
          <div>
            <SectionTitle>AI / ML Roadmap (2026)</SectionTitle>
            <div style={{ fontSize: FONT.sm, color: T.muted }}>{SECTIONS.length} sections · {CURRICULUM.length} explained topics · progress saved on this device</div>
          </div>
          <div style={{ minWidth: 220, flex: "0 1 340px" }}>
            <ProgressBar value={completedCount} max={CURRICULUM.length} label="Overall completion" />
          </div>
        </div>

        <div style={{ ...PANEL.base, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input aria-label="Search roadmap topics" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search all roadmap topics and explanations" style={{ ...inputStyle, flex: 1 }} />
            {query && <button type="button" onClick={() => setQuery("")} style={BUTTON.toggle(false)}>Clear</button>}
          </div>
          {query && (
            <div aria-live="polite" style={{ marginTop: 10 }}>
              <div style={{ fontSize: FONT.sm, color: T.muted, marginBottom: 6 }}>{results.length} matching topics</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 260, overflowY: "auto" }}>
                {results.slice(0, 60).map((item) => (
                  <button key={item.id} type="button" onClick={() => visitTopic(item)} style={{ border: `1px solid ${T.border}`, background: T.surface, borderRadius: LAYOUT.radiusMd, padding: "7px 9px", textAlign: "left", color: T.ink, cursor: "pointer", fontFamily: "inherit", fontSize: FONT.sm, lineHeight: 1.5 }}>
                    <span style={{ color: T.accent, fontWeight: 700 }}>{item.sectionLabel}:</span> {item.title}
                  </button>
                ))}
                {results.length > 60 && <div style={{ fontSize: FONT.sm, color: T.muted }}>Refine the search to view the remaining {results.length - 60} results.</div>}
              </div>
            </div>
          )}
        </div>

        <SectionTitle>{section.label}</SectionTitle>
        <AnalogyBox>{section.analogy}</AnalogyBox>
        {section.id === "map" && <StageOverview completed={completed} />}
        {section.kind === "labs" ? (
          <DecisionLabs section={section} completed={completed} onToggleComplete={toggleComplete} />
        ) : (
          <>
            <GuidedLesson section={section} />
            <TopicExplorer section={section} completed={completed} openTopics={openTopics} onToggleOpen={toggleOpen} onToggleComplete={toggleComplete} />
          </>
        )}
      </main>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "10px 24px", background: T.panel, borderTop: `1px solid ${T.border}` }}>
        <button type="button" disabled={sectionIndex <= 0} onClick={() => move(-1)} style={{ ...BUTTON.toggle(false), opacity: sectionIndex <= 0 ? 0.45 : 1 }}>Previous</button>
        <div style={{ fontSize: FONT.sm, color: T.muted, textAlign: "center" }}>{sectionIndex + 1} of {SECTIONS.length}</div>
        <button type="button" disabled={sectionIndex >= SECTIONS.length - 1} onClick={() => move(1)} style={{ ...BUTTON.toggle(sectionIndex < SECTIONS.length - 1), opacity: sectionIndex >= SECTIONS.length - 1 ? 0.45 : 1 }}>Next</button>
      </div>
    </div>
  );
}
