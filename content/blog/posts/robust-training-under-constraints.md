

In a previous post, I mentioned a setup where we had about 10 weeks to improve an algorithm, but each full training run was taking nearly 3 weeks. Here’s the breakdown of that project, where my team and I were tasks in improving the SELF algorithm this paper:[ Towards Last-layer Retraining for Group Robustness with Fewer Annotations](https://proceedings.neurips.cc/paper_files/paper/2023/file/265bee74aee86df77e8e36d25e786ab5-Paper-Conference.pdf )

## The Core Problem
We were talking a core issue in classification models is that they often learn spurious correlations. Classification models can often fit on features that are incidental to the actual object to be classified. This can happen because the incidental features may be easier to fit to. For example, given a cow/camel image classification model, the model may use details outside the animal in question. It may fit for a grassy or sandy background.  

---

## Where the Problem Actually Lives

What’s interesting is that the problem isn’t usually the entire model. Deep layers still learn useful representations (textures, shapes, structure). The issue often sits in the last layer, where those features get mapped to predictions. That’s where shortcuts get reinforced. This leads to a key idea: instead of retraining everything, focus on fixing the last layer. Baselines like class balancing help, but they don’t directly address why mistakes happen. Group balancing is stronger but requires annotations. Methods like “train twice” try to reweight mistakes, but they’re still fairly coarse.  

---

## SELF

SELF (Selective Last-layer Fine-Tuning) improves on this by identifying which samples matter most. It selects examples based on signals like misclassification or disagreement and retrains only on those. The goal is to focus learning on the parts of the data where the model is uncertain or wrong, rather than treating all samples equally.  

---

## Data + Setup

We worked with a variety of 4 text based datasets sets and four image based data sets on RESNET 50 and BERT respectively.  

---

## Evaluation

Instead of standard accuracy, we evaluate using worst-group accuracy, which measures the lowest-performing subgroup. This better captures robustness, since a model that fails on a minority group is still problematic even if average accuracy is high.  

---

## Limitations of SELF

A limitation of SELF is that its selection strategies can be noisy. Misclassification-based methods over-focus on outliers, while disagreement-based methods can ignore clear but important mistakes.  

---

## Our Approach: Hybrid Soft-Weighted SELF

To improve robustness, we moved to a hybrid soft-weighted SELF approach instead of hard-selecting samples. The idea was simple: compute two signals for each example—a disagreement score (how unstable the model’s predictions are) and a loss score (how wrong the model is). We then combine these using weighting parameters (α for disagreement, β for loss) to form a hybrid importance score, which is converted into training weights. More important samples get higher weights, while the average weight stays around 1 to keep training stable. Instead of throwing away data, we retrain the final layer using a weighted loss over the full dataset, allowing the model to focus more on informative examples without introducing noise from hard selection.  

---

## Results

In terms of results, this approach performed well: validation accuracy reached 92.2% with a worst-group accuracy of 85.5%, and test accuracy reached 92.9% with a worst-group accuracy of 83.3%. We also observed that emphasizing disagreement (α = 0.8) gave the best robustness across validation and test, while putting too much weight on loss (β = 0.8) actually hurt worst-group performance, dropping it from 83.3% to 76.8%. This suggests that uncertainty signals are more useful than raw error when trying to improve robustness.  

---

## Back to the Training Problem

Before optimizing anything, we defined what “performance” meant: training time, throughput (samples/sec), GPU utilization, step time consistency, and memory usage. We built a baseline, profiled where time was going (compute vs data vs communication), and turned it into a loop: measure → diagnose → fix. The main issue was iteration speed. Each full run took weeks, so we couldn’t test many ideas. On a smaller setup (ResNet), training took ~6 hours, which made experimentation much easier, but we still had to scale to the full problem with BERT.  

---

## SLURM Constraint

Another constraint we had to deal with was SLURM time limits as jobs would get cut off after ~48 hours, while our training ran much longer. To handle this, we added checkpointing so the model could save progress and resume later, and split training into multiple runs instead of one long job. This made the workflow a bit more complex, but also more reliable.  

---

## Distributed Training Improvements

Our first improvement was moving from a single GPU to DDP, tracking samples/sec, step time, and utilization. With 3 GPUs, we reduced training time from ~3 weeks to ~5 days. A key optimization here was gradient bucketing in NCCL AllReduce. Instead of syncing all gradients at once, they’re grouped into buckets (we found the perfect size was ~25MB), and communication starts as soon as each bucket is ready during backprop. This lets communication overlap with compute, reducing idle time and improving step efficiency.  

---

## Bottleneck Shift

That was a huge win, but when we looked at the GPU utilization graph, it wasn’t smooth, it looked like a heart rate monitor during a horror movie. Instead of staying consistently high (~90–100%), utilization kept dropping, consistently dipping significantly between steps. That told us the bottleneck wasn’t compute anymore. From profiler timelines and step gaps, we saw the GPUs were waiting on data. The issue was the data pipeline: slow loading, preprocessing, and CPU → GPU transfer.  

---

## What’s Next

And that’s what led into the next phase of my work… learning how to build a faster, more efficient data pipeline… stay tuned :)